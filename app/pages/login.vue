<script setup lang="ts">
import logoSf from '~/assets/images/logoSf.svg?url'
import universImg from '~/assets/images/univers.png'

definePageMeta({ layout: false })

const route = useRoute()
const { login } = useAuth()

const password = ref('')
const error = ref('')
const loading = ref(false)

async function onSubmit() {
  error.value = ''
  loading.value = true

  try {
    await login(password.value)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await navigateTo(redirect)
  }
  catch {
    error.value = 'Mot de passe incorrect.'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login">
    <img :src="universImg" alt="" class="login__backdrop" >
    <div class="login__scrim" />

    <div class="login__card">
      <img :src="logoSf" alt="Safe Campus" class="login__logo" >

      <p class="login__subtitle">Espace réservé — accès visiteur</p>

      <form class="login__form" @submit.prevent="onSubmit">
        <label class="login__label" for="login-password">Mot de passe</label>

        <input
          id="login-password"
          v-model="password"
          type="password"
          class="login__input"
          :class="{ 'login__input--error': error }"
          autofocus
          required
        >

        <p v-if="error" class="login__error">{{ error }}</p>

        <button type="submit" class="login__submit" :disabled="loading">
          {{ loading ? 'Connexion…' : 'Se connecter' }}
        </button>
      </form>
    </div>

    <div class="login__footer">
      <SiteFooter />
    </div>
  </div>
</template>
