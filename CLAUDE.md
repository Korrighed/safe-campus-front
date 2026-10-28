# CLAUDE.md

**Stack:** Nuxt 4 · Vue 3 · TypeScript · Vite 8 · CSS (BEM + variables)

👉 See [README](README.md) for setup and commands.

> Le code s'édite sur l'hôte, les commandes s'exécutent dans le container via `docker compose exec sc_front <cmd>`.

---

## Code Conventions

**No `<style>` blocks** — all CSS in `app/assets/css/` :
- `main.css` : base globale (polices, variables, reset, animations, layout) + `@import` des autres fichiers.
- `components/<nom-kebab>.css` : un fichier par composant (`CardItem.vue` → `card-item.css`).
- `pages/<page>.css` : styles propres à une page.
- Nouveau fichier → l'ajouter aux `@import` de `main.css`, en respectant l'ordre (la cascade en dépend).

**BEM naming:** `.bloc__element--modificateur`

**CSS variables** for shared values (colors, spacing, etc.).

**Component order:** imports → props & emits → state (`ref`/`reactive`) → computed → functions.

**API calls:** `$fetch()` through a composable (`useThemes`, `useAuth`…). Base URL from `useApiBase()`: internal Docker hostname during SSR, `runtimeConfig.public.apiBase` in the browser. The visitor token is stored in the `sc_token` cookie; read requests do not send it, because the back's read routes are public by design. The visitor login is a prototype-only gate for events, removed at the official launch (§ 4.1 of the back's `docs/securite-rgpd.md`). The SSR uses `runtimeConfig.apiBaseInternal`, whose default is computed at **build** time in `nuxt.config.ts`: in production, `NUXT_API_BASE_INTERNAL` must be set at runtime (see the README), otherwise server-rendered pages query `http://localhost:8000` and answer 404. API contracts: [Safe-Campus-back/docs/api.md](../Safe-Campus-back/docs/api.md).

**Navigation:** Nuxt file-based routing (`app/pages/`), `<NuxtLink>` and `navigateTo()`. Global auth middleware: `app/middleware/auth.global.ts`.

**Icônes :** [Heroicons](https://heroicons.com/) (style *outline*, 24×24, `stroke-width="1.5"`). Fichiers `.svg` sources dans `app/assets/icon/<nom>.svg` (nom = slug Heroicons), récupérés via le CDN jsDelivr (`https://cdn.jsdelivr.net/npm/heroicons@<version>/24/outline/<nom>.svg`) plutôt que copiés à la main. Importés en composant Vue via `vite-svg-loader` (`import IconPhone from '~/assets/icon/phone.svg'` puis `<IconPhone class="..." />`) — jamais de tracé SVG dupliqué en dur dans un template. `fill="none" stroke="currentColor"` pour hériter la couleur du parent.

## Git

- Workflow git flow : `feature/*` pour le dev, merge sur `dev` en `--no-ff`. `hotfix/*` créé depuis `main`.
- Une fois une `feature/*` mergée dans `dev` et poussée sur `origin/dev`, supprimer la branche locale (`git branch -d`). Ne pas laisser de branches `feature/*` locales après clôture.
- Avant de merger une branche `feature/*`, `bugfix/*`, `hotfix/*` ou autre sur `dev` ou `main` : proposer à l'utilisateur un dernier commit dédié, en fin de branche, à la vérification `typecheck` + `lint` (et aux correctifs de qualité de code que ça implique). Ne jamais merger sans avoir proposé ce commit.
- La CI (`verif`) rejoue build, typecheck et lint sur chaque push et chaque PR ; elle ne remplace pas ce commit de vérification mais le confirme. `main` est protégée : PR obligatoire, checks `verif` et `approfondi` verts, `dev` à jour de `main` avant la PR. Voir le [README](README.md#intégration-continue).
- Jamais de `Co-Authored-By` dans les messages de commit.
- Format de message de commit obligatoire :

```
type(scope): phrase résumé.
- ajout 1
- ajout 2
```

Exemple :

```
infra(docker): mise a jour de dépendances sur le conteneur.
- ajout de git
- installation des dépendances php laravel
```
