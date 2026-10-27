// Le SSR tourne dans le conteneur Docker (hostname interne joignable),
// le navigateur tourne hors de Docker (seul le port publie sur l'hote
// est joignable). Meme cle logique, deux URL differentes selon le contexte.
export function useApiBase(): string {
  const config = useRuntimeConfig()
  return import.meta.server ? config.apiBaseInternal : config.public.apiBase
}
