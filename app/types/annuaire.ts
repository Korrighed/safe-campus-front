// Formes des reponses de l'API annuaire (Safe-Campus-back, routes/api.php).
// Un type par Resource Laravel — voir app/Http/Resources dans le back.

export interface MediaApi {
  libelle: string
  description: string | null
  url: string | null
  type: 'image' | 'video' | 'audio' | 'document'
}

export interface TelephoneApi {
  numero: string
  numero_vert: boolean
  type: 'mobile' | 'fixe' | 'sms' | 'urgence'
  libelle: string | null
}

export interface ContactApi {
  ref: string
  nom: string
  prenom: string | null
  mail: string | null
  localisation: string | null
  site_web: string | null
  horaires: string | null
  remarques: string | null
  gratuit: boolean | null
  anonyme: boolean | null
  latitude: number | null
  longitude: number | null
  telephones: TelephoneApi[]
}

export interface SousThemeSummaryApi {
  ref: string
  libelle: string
  resume: string | null
  ordre: number
  histoire_ref: string | null
}

export interface ThemeApi {
  ref: string
  libelle: string
  libelle_court: string | null
  resume: string | null
  ordre: number
  medias: MediaApi[]
  sous_themes: SousThemeSummaryApi[]
}

export interface HistoireSummaryApi {
  ref: string
  titre: string
}

export interface ChoixApi {
  id: number
  text_choix: string
  // null = sortie du parcours, qualifiee par `issue`.
  next_scene_id: number | null
  issue: 'favorable' | 'defavorable' | null
  // Present uniquement sur un choix defavorable : contacts deja resolus par le back.
  contacts?: ContactApi[]
}

export interface SceneApi {
  id: number
  dialogue_text: string
  media: MediaApi | null
  choix: ChoixApi[]
}

// GET /api/histoires/{ref} : le graphe complet, joue localement sans nouvel appel.
export interface HistoireApi {
  ref: string
  titre: string
  scene_initiale_id: number | null
  scenes: SceneApi[]
}

export interface SousThemeDetailApi {
  ref: string
  libelle: string
  article: string | null
  intro_ressources: string | null
  theme: {
    ref: string
    libelle_court: string | null
  }
  contacts: ContactApi[]
  documents: MediaApi[]
  histoires: HistoireSummaryApi[]
}

// Formes d'affichage front, construites a partir des types API ci-dessus.

export interface ThemeItemView {
  id: number
  slug: string
  title: string
  hook: string | null
  ninja: string | undefined
  subtitle: string
  histoireRef: string | null
}

export interface ThemeView {
  id: string
  label: string
  shortLabel: string | null
  color: string
  items: ThemeItemView[]
}

export interface DisplayContact {
  ref: string
  name: string
  role: string | null
  email: string | null
  hours: string | null
  address: string | null
  website: string | null
  telephones: ContactApi['telephones']
  lat: number | null
  lng: number | null
}

// Contact dont la position est connue : partage entre la page contact
// (filtrage) et <ContactMap> (marqueurs, geolocalisation).
export interface LocatedContact extends Omit<DisplayContact, 'lat' | 'lng'> {
  lat: number
  lng: number
}
