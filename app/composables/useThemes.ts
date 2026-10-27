import { computed } from 'vue'
import { sousThemeNinjas, themePresentation } from '~/data/presentation'
import type { ThemeApi, ThemeView } from '~/types/annuaire'

// Arborescence des thematiques (GET /api/themes) projetee dans la forme
// d'affichage front `ThemeView`. Requete partagee via la cle 'themes' : le
// menu global (layout) et la page d'accueil consomment le meme cache.
export async function useThemes() {
  const apiBase = useApiBase()

  const { data, error, refresh } = await useAsyncData('themes', () =>
    $fetch<{ data: ThemeApi[] }>(`${apiBase}/api/themes`),
  )

  const themes = computed<ThemeView[]>(() => (data.value?.data ?? []).map(theme => ({
    id: theme.ref,
    label: theme.libelle,
    shortLabel: theme.libelle_court,
    color: themePresentation[theme.ref]?.color ?? '#4260e6',
    items: theme.sous_themes.map((sousTheme, index) => ({
      id: index + 1,
      slug: sousTheme.ref,
      title: sousTheme.libelle,
      hook: sousTheme.resume,
      ninja: sousThemeNinjas[sousTheme.ref],
      subtitle: `${themePresentation[theme.ref]?.prefixe ?? ''} N°${index + 1}`,
      histoireRef: sousTheme.histoire_ref,
    })),
  })))

  return { themes, error, refresh }
}
