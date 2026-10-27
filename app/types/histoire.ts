// Types d'affichage propres a la page /histoire/[theme]/[slug].
// Distincts des types API (annuaire.ts) : ceux-ci decrivent l'etat local de la
// page (placeholder ou graphe joue), pas le contrat JSON du back.

import type { HistoireApi, SceneApi } from './annuaire'

export type HistoirePageState =
  | { status: 'placeholder' }
  | { status: 'ready', histoire: HistoireApi, scenesParId: Map<number, SceneApi> }
