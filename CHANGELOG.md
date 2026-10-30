# Historique des versions — Safe Campus front

Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/). Versionnage [SemVer](https://semver.org/lang/fr/).

## [1.0.0] — 2026-10-30

Première version de clôture du projet.

### Ajouté

- Bouton retour sur les pages et lien de retour vers la thématique.
- Page des données personnelles.
- Intégration continue du front, déclenchement manuel.
- Préparation de la production : image Docker, conteneurs non-root.
- En-têtes de sécurité HTTP posés par `routeRules` (S-05).

### Modifié

- Documentation alignée sur celle du back (renvois vers les dépôts GitHub).

### Corrigé

- Vulnérabilités `node-forge` (1.4.2) et `serialize-javascript`.

## Avant 1.0.0

Développement du site étudiant entre le 23/08/2026 et le 28/10/2026, sans version publiée : navigation et menu latéral, fiches contacts avec carte, recherche par synonymes, suivi des histoires, authentification visiteur, CGU et mentions légales, typage TypeScript des composants.
