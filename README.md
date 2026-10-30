# Safe Campus — Front

Interface utilisateur du projet SAE501. Construit avec **Nuxt 4** et **Vue 3**.

Version : **1.0.0** ([historique des versions](CHANGELOG.md)).

Dépôts GitHub : [Korrighed/safe-campus-front](https://github.com/Korrighed/safe-campus-front) (ce dépôt) et [Korrighed/safe-campus-back](https://github.com/Korrighed/safe-campus-back) (API, back-office et documentation du projet).

> Ce repo fonctionne en binôme avec [safe-campus-back](https://github.com/Korrighed/safe-campus-back), mais possède son propre `docker-compose.yml` — les deux stacks se lancent indépendamment. Elles se partagent le réseau Docker `scback` (nom fixe, voir `docker-compose.yml`) : si les deux tournent, `sc_front` joint `sc_back` par son nom de conteneur ; sinon `sc_front` démarre quand même, seul le SSR côté API est mort.

---

## Démarrage

Ce repo a son propre `docker-compose.yml`. Le code s'édite sur l'hôte, les commandes s'exécutent dans le container.

```bash
cp .env.example .env
sed -i "s/^WWWUSER=.*/WWWUSER=$(id -u)/" .env
sed -i "s/^WWWGROUP=.*/WWWGROUP=$(id -g)/" .env

docker compose up -d
```

### 1. Full stack (avec le back)

```bash
cd ../safe-campus-back && docker compose up -d
cd ../safe-campus-front && docker compose up -d
```

Démarre `SC_Back`, `SC_Front`, `SC_Postgres` et `SC_Adminer` (deux stacks compose distinctes, réseau partagé). Voir le [README du back](https://github.com/Korrighed/safe-campus-back#readme) pour son `.env`.

> Le front consomme l'API du back : `POST /api/login`, `GET /api/themes`, `GET /api/sous-themes/{ref}`, `GET /api/histoires/{ref}`. Contrats : [cahier des charges du back, § 3.3](https://github.com/Korrighed/safe-campus-back/blob/main/docs/cahier-des-charges-techniques.md#33-api).

### 2. Frontend seul (sans le back)

```bash
docker compose up -d
```

Démarre uniquement `SC_Front`, sans dépendre du repo back. Les endpoints API sont morts, mais tu peux bosser sur **UI, CSS, composants** sans dépendances.

### Exécuter les commandes dans le container

`SC_Front` lance `npm install` puis `npm run dev` au démarrage. Pour le reste :

```bash
docker compose exec sc_front npm run lint
```

Ouvrir le code : `code .` depuis WSL, à la racine de ce repo.

### Logs

```bash
docker compose logs -f sc_front
```

---

## Ports

| Port | Service |
|---|---|
| `3000` (`FRONT_PORT`) | Nuxt dev server et WebSocket HMR de Vite → http://localhost:3000 |

---

## Variables d'environnement

Copier `.env.example` en `.env` :

| Variable | Défaut | Description |
|---|---|---|
| `NUXT_PUBLIC_API_BASE` | `http://localhost:8000` | URL de l'API Laravel |

> Dans le stack Docker, `NUXT_PUBLIC_API_BASE` est injecté par le `docker-compose.yml` de ce repo (calculé à partir de `APP_PORT`, qui doit correspondre à la valeur du `.env` du back).

Deux adresses d'API coexistent : `NUXT_PUBLIC_API_BASE` pour le **navigateur**, `NUXT_API_BASE_INTERNAL` pour le **rendu côté serveur** (`useApiBase`). En dev, le `docker-compose.yml` fixe la seconde sur le nom du conteneur du back. En prod, voir la section Déploiement.

Les fichiers `.env.*` réels sont ignorés par git et par Docker (`.gitignore`, `.dockerignore`) ; seuls `.env.example` et `.env.production.example` sont suivis.

---

## Structure

```
safe-campus-front/
├── app/
│   ├── pages/          Pages Nuxt (une page = une route)
│   ├── components/     Composants Vue réutilisables
│   ├── composables/    Composables useXxx() (useApiBase, useAuth, useThemes)
│   ├── layouts/        Layouts Nuxt
│   ├── middleware/     auth.global.ts (portillon visiteur)
│   ├── data/           Contenu statique (présentation)
│   ├── types/          Types TypeScript (annuaire, histoire, svg)
│   ├── utils/          Fonctions utilitaires
│   └── assets/
│       ├── css/        main.css + components/*.css + pages/*.css
│       ├── icon/       Icônes SVG Heroicons
│       └── images/     Logo et visuels
├── public/         Fichiers statiques
├── nuxt.config.ts  Configuration Nuxt
├── docker/
│   ├── Dockerfile       Image Node 22 (dev)
│   ├── start-container  npm install puis npm run dev (dev)
│   └── Dockerfile.prod  Image de prod (multi-stage)
├── docker-compose.yml       Orchestration dev : sc_front (+ reseau partage avec le back)
└── docker-compose.prod.yml  Orchestration prod
```

---

## Déploiement (prod)

> Aucun hébergeur de production n'est retenu. L'image se déploie sur tout hôte Docker, derrière un reverse proxy TLS fourni par l'hébergement. Déploiement du back, vérifications après déploiement et pannes fréquentes : [README du back, § 5](https://github.com/Korrighed/safe-campus-back#5-déploiement-en-production).

`docker-compose.prod.yml` + `docker/Dockerfile.prod`, stack séparée du dev (`SC_Front_Prod`, pas de réseau partagé avec le back).

- Build multi-stage : `npm run build` (Nuxt/Nitro, preset `node-server`) puis image runtime `node:22-slim` qui ne contient que `.output/` — pas de `node_modules` ni de code source à l'exécution.
- Pas de réseau Docker partagé entre les stacks back et front en prod : `NUXT_PUBLIC_API_BASE` **et** `NUXT_API_BASE_INTERNAL` doivent pointer vers l'URL **publique** du back.
- **`NUXT_API_BASE_INTERNAL` est obligatoire en prod, à l'exécution.** `nuxt.config.ts` calcule sa valeur par défaut au build, quand `NUXT_PUBLIC_API_BASE` n'est pas encore fournie : le rendu serveur interroge alors `http://localhost:8000` et les pages de contenu répondent 404 « Rubrique introuvable ». Un rebuild n'y change rien.
- Variables à saisir dans la configuration de l'hébergement : voir [.env.production.example](.env.production.example).
- Le conteneur écoute sur `PORT` (3000). Sonde de disponibilité : `/mentions-legales`, accessible sans le portillon.
- Le conteneur tourne avec l'utilisateur non root `node`, fourni par l'image. `.output/` appartient à root : le processus ne peut pas le modifier ([securite-rgpd.md du back, § 8](https://github.com/Korrighed/safe-campus-back/blob/main/docs/securite-rgpd.md#8-infrastructure-et-déploiement)). En dev, le conteneur tourne avec l'utilisateur `nuxt`, sans `sudo`.

Limites connues du front en ligne (état suivi dans le [cahier des charges du back, § 5](https://github.com/Korrighed/safe-campus-back/blob/main/docs/cahier-des-charges-techniques.md#5-exigences-non-fonctionnelles)) :

- en-têtes de sécurité posés par `routeRules`, sans CSP de scripts ; `x-powered-by: Nuxt` reste exposé (codé en dur dans Nuxt) ;
- le cookie `sc_token` du portillon n'a pas l'attribut `Secure` ni `HttpOnly` ;
- les polices viennent de Google Fonts.

---

## Intégration continue

Le workflow `.github/workflows/ci.yml` (GitHub Actions) s'exécute sur les push et les pull requests vers `dev` et `main`.

| Job | Quand | Contrôles |
|---|---|---|
| `verif` | Toujours | `npm ci`, `npm run build`, `npm run typecheck`, `npm run lint` |
| `approfondi` | PR vers `main`, push sur `main`, lancement manuel depuis `main` | `npm audit` (bloquant en *critical*, affichage seul pour *high*), build de l'image de prod, démarrage et contrôle de `/mentions-legales`, scan Trivy |

Lancer `npm run typecheck && npm run lint` en local avant de pousser évite un aller-retour. `main` est protégée : PR obligatoire, checks `verif` et `approfondi` verts. Détails et réglages GitHub : [README du back, § 6](https://github.com/Korrighed/safe-campus-back#6-intégration-continue).

---

## Conventions

- **Pas de `<style>` dans les `.vue`** — tout le CSS va dans `app/assets/css/` (`main.css`, `components/<nom>.css`, `pages/<page>.css`), détail dans [CLAUDE.md](CLAUDE.md)
- **BEM** pour le nommage CSS : `.bloc__element--modificateur`
- **CSS variables** pour toutes les valeurs partagées (couleurs, espacements, etc.)
- **Ordre dans les composants** : imports → props & emits → state (`ref`/`reactive`) → computed → fonctions
- **Appels API** : via un composable, avec `useApiBase()` pour l'URL de base (adresse interne en SSR, publique dans le navigateur)
