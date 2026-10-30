<script setup lang="ts">
import IconArrowLeft from '~/assets/icon/arrow-left.svg?component'

const router = useRouter()

// Revient a la page precedente du site. Si on est arrive directement sur la
// page (lien partage, onglet neuf), il n'y a pas d'historique interne :
// on renvoie vers l'accueil plutot que de quitter le site.
function goBack() {
  if (window.history.state?.back) {
    router.back()
  } else {
    navigateTo('/')
  }
}
</script>

<template>
  <button
    type="button"
    class="back-button"
    aria-label="Revenir à la page précédente"
    @click="goBack"
  >
    <IconArrowLeft class="back-button__icon" aria-hidden="true" />
    <span class="back-button__label">Retour</span>
  </button>
</template>
