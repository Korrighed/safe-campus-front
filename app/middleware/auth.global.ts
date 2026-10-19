// Pages accessibles sans mot de passe visiteur : la connexion elle-meme et les
// pages legales, qui doivent rester lisibles par tout le monde (LCEN).
const PUBLIC_PATHS = ['/login', '/mentions-legales', '/cgu']

export default defineNuxtRouteMiddleware((to) => {
  if (PUBLIC_PATHS.includes(to.path)) return

  const { isAuthenticated } = useAuth()
  if (!isAuthenticated.value) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})
