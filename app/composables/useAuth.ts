// Token Sanctum du compte visiteur unique, stocke en cookie (lisible en SSR
// et cote navigateur, contrairement a localStorage) — pas de session/cookie
// Sanctum stateful, juste un Bearer token rejoue par le back.
export function useAuth() {
  const token = useCookie<string | null>('sc_token', { default: () => null, sameSite: 'lax' })
  const apiBase = useApiBase()

  const isAuthenticated = computed(() => !!token.value)

  async function login(password: string) {
    const response = await $fetch<{ token: string }>(`${apiBase}/api/login`, {
      method: 'POST',
      body: { password },
    })
    token.value = response.token
  }

  function logout() {
    token.value = null
  }

  return { token, isAuthenticated, login, logout }
}
