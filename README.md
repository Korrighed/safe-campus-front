# Safe Campus — Front

Interface utilisateur du projet SAE501. Construit avec **Nuxt 4** et **Vue 3**.

> Ce repo fonctionne en binôme avec [Safe-Campus-back](../Safe-Campus-back), mais possède son propre `docker-compose.yml` — les deux stacks se lancent indépendamment. Elles se partagent le réseau Docker `scback` (nom fixe, voir `docker-compose.yml`) : si les deux tournent, `sc_front` joint `sc_back` par son nom de conteneur ; sinon `sc_front` démarre quand même, seul le SSR côté API est mort.

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
cd ../Safe-Campus-back && docker compose up -d
cd ../Safe-Campus-front && docker compose up -d
```

Démarre `SC_Back`, `SC_Front`, `SC_Postgres` et `SC_Adminer` (deux stacks compose distinctes, réseau partagé). Voir le [README du back](../Safe-Campus-back/README.md) pour son `.env`.

> Le front consomme l'API du back : `POST /api/login`, `GET /api/themes`, `GET /api/sous-themes/{ref}`, `GET /api/histoires/{ref}`. Contrats : [schema_bd.md du back](../Safe-Campus-back/docs/schema_bd.md#consommation-api).

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
| `3000` | Nuxt dev server → http://localhost:3000 |
| `24678` | Vite HMR |

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
Safe-Campus-front/
├── app/
│   ├── pages/          Pages Nuxt (une page = une route)
│   ├── components/     Composants Vue réutilisables
│   ├── composables/    Composables useXxx()
│   ├── layouts/        Layouts Nuxt
│   └── assets/css/     Styles globaux
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

> Aucun hébergeur de production n'est retenu. L'image se déploie sur tout hôte Docker, derrière un reverse proxy TLS fourni par l'hébergement. Une **démo publique temporaire** tourne sur Render (offre gratuite) avec le back et une base Neon : procédure complète, variables et pièges dans [docs/deploiement-render.md](https://github.com/Korrighed/safe-campus-back/blob/main/docs/deploiement-render.md) du dépôt back.

`docker-compose.prod.yml` + `docker/Dockerfile.prod`, stack séparée du dev (`SC_Front_Prod`, pas de réseau partagé avec le back).

- Build multi-stage : `npm run build` (Nuxt/Nitro, preset `node-server`) puis image runtime `node:22-slim` qui ne contient que `.output/` — pas de `node_modules` ni de code source à l'exécution.
- Pas de réseau Docker partagé entre les stacks back et front en prod : `NUXT_PUBLIC_API_BASE` **et** `NUXT_API_BASE_INTERNAL` doivent pointer vers l'URL **publique** du back.
- **`NUXT_API_BASE_INTERNAL` est obligatoire en prod, à l'exécution.** `nuxt.config.ts` calcule sa valeur par défaut au build, quand `NUXT_PUBLIC_API_BASE` n'est pas encore fournie : le rendu serveur interroge alors `http://localhost:8000` et les pages de contenu répondent 404 « Rubrique introuvable ». Un rebuild n'y change rien.
- Variables à saisir dans la configuration de l'hébergement : voir [.env.production.example](.env.production.example).
- Sur Render : service Docker, branche `main`, région du back (Oregon), Dockerfile `./docker/Dockerfile.prod`, `PORT=3000`, Health Check Path `/mentions-legales` (et non `/healthz`, qui n'existe pas), Auto-Deploy désactivé.
- Le conteneur tourne avec l'utilisateur non root `node`, fourni par l'image. `.output/` appartient à root : le processus ne peut pas le modifier (S-12, [securite-rgpd.md du back](../Safe-Campus-back/docs/securite-rgpd.md#8-infrastructure-et-déploiement)). En dev, le conteneur tourne avec l'utilisateur `nuxt`, sans `sudo`.

Limites connues du front en ligne (suivi dans le [securite-rgpd.md](../Safe-Campus-back/docs/securite-rgpd.md) du back, § 10) :

- aucun en-tête de sécurité HTTP posé par le front (S-05) et l'en-tête `x-powered-by: Nuxt` est exposé ;
- le cookie `sc_token` du portillon n'a pas l'attribut `Secure` ni `HttpOnly` (S-04, S-17) ;
- les polices viennent de Google Fonts (S-08).

---

## Intégration continue

Le workflow `.github/workflows/ci.yml` (GitHub Actions) s'exécute sur les push et les pull requests vers `dev` et `main`.

| Job | Quand | Contrôles |
|---|---|---|
| `verif` | Toujours | `npm ci`, `npm run build`, `npm run typecheck`, `npm run lint` |
| `approfondi` | PR vers `main`, push sur `main`, lancement manuel depuis `main` | `npm audit` (bloquant en *critical*, affichage seul pour *high*), build de l'image de prod, démarrage et contrôle de `/mentions-legales`, scan Trivy |

Lancer `npm run typecheck && npm run lint` en local avant de pousser évite un aller-retour. `main` est protégée : PR obligatoire, checks `verif` et `approfondi` verts. Détails et réglages GitHub : [docs/ci.md](https://github.com/Korrighed/safe-campus-back/blob/main/docs/ci.md) du dépôt back.

---

## Conventions

- **Pas de `<style>` dans les `.vue`** — tout le CSS va dans `assets/css/main.css`
- **BEM** pour le nommage CSS : `.bloc__element--modificateur`
- **CSS variables** pour toutes les valeurs partagées (couleurs, espacements, etc.)
- **Ordre dans les composants** : imports → props & emits → state (`ref`/`reactive`) → computed → fonctions
- **Appels API** : via `useRuntimeConfig().public.apiBase` pour l'URL de base
