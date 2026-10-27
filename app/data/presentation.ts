// Presentation front-only, indexee par le `ref` renvoye par l'API
// (GET /api/themes, GET /api/sous-themes/{ref}). Le contenu editorial
// (libelle, resume, article, contacts...) vient du back, voir
// Safe-Campus-back/docs/textes-front.md.

interface ThemePresentation {
  color: string
  prefixe: string
}

export const themePresentation: Record<string, ThemePresentation> = {
  addictions: { color: '#4260e6', prefixe: 'COMPORTEMENT ADDICTIF' },
  sante_mentale: { color: '#4260e6', prefixe: 'SANTÉ MENTALE' },
  vss: { color: '#4260e6', prefixe: 'VIOLENCE' },
}

export const sousThemeNinjas: Record<string, string> = {
  alcool: '/assets/ninja_alcool.png',
  tabac: '/assets/ninja_cigarette.png',
  drogue: '/assets/ninja_drogue.png',
  anxiete: '/assets/ninja-anxiete.png',
  depression: '/assets/ninja-depression.png',
  burn_out: '/assets/ninja_burnout.png',
  violences_sexistes: '/assets/ninja_violenceSexiste.png',
  violences_sexuelles: '/assets/ninja_violenceSexuelles.png',
  harcelement: '/assets/ninja_harcelement.png',
}

// Synonymes/mots-cles par sous-theme (`ref` backend), pour que la recherche
// (SearchBar.vue) retrouve un sous-theme via un terme familier ou proche
// qui n'apparait pas dans son libelle/resume backend.
export const sousThemeSynonyms: Record<string, string[]> = {
  alcool: ['biere', 'vin', 'alcoolisme', 'ivresse', 'alcoolique', 'binge drinking'],
  tabac: ['cigarette', 'cigarettes', 'clope', 'clopes', 'nicotine', 'vapotage', 'vape', 'e-cigarette', 'fumer'],
  drogue: ['cannabis', 'weed', 'shit', 'beuh', 'joint', 'stupefiant', 'stupefiants', 'drogues', 'cocaine', 'ecstasy', 'mdma'],
  anxiete: ['stress', 'angoisse', 'panique', 'crise d\'angoisse'],
  depression: ['deprime', 'moral', 'tristesse', 'mal-etre'],
  burn_out: ['burnout', 'epuisement', 'surmenage', 'fatigue'],
  violences_sexistes: ['sexisme', 'discrimination', 'inegalites', 'sexiste'],
  violences_sexuelles: ['viol', 'agression sexuelle', 'attouchements', 'consentement'],
  harcelement: ['harcelement scolaire', 'cyberharcelement', 'bullying', 'intimidation'],
}
