<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import SideNav from '~/components/SideNav.vue'
import NavDrawer from '~/components/NavDrawer.vue'
import IconArrowUp from '~/assets/icon/arrow-up.svg?component'

// Menu global : present sur toutes les pages qui utilisent ce layout.
const { themes } = await useThemes()

const route = useRoute()

// Burger permanent (mobile / tablette) : accessible en toute circonstance,
// sur toutes les pages. Le rail lateral prend le relais a partir de 1200px.
const menuOpen = ref(false)

// Bouton "retour en haut" : visible sur toutes les pages des qu'on a
// suffisamment scrolle.
const showBackToTop = ref(false)

function handleScroll() {
  showBackToTop.value = window.scrollY > 400
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <div class="layout">
    <SideNav :themes="themes" />

    <!-- Colonne d'actions flottante (mobile / tablette) : retour accueil
         au-dessus, burger en dessous. Le lien accueil est masque sur la
         page d'accueil (le header y porte deja le logo) ; toute la colonne
         disparait a partir de 1200px (le rail lateral prend le relais). -->
    <div class="nav-actions">
      <NuxtLink
        v-if="route.path !== '/'"
        to="/"
        class="nav-home"
        aria-label="Retour à l'accueil"
      >
        <img src="/assets/logoNinjaHead.png" alt="" >
      </NuxtLink>

      <button
        type="button"
        class="nav-fab"
        :class="{ 'nav-fab--open': menuOpen }"
        aria-label="Ouvrir le menu"
        @click="menuOpen = true"
      >
        <span /><span /><span />
      </button>
    </div>

    <NavDrawer v-model="menuOpen" :themes="themes" />

    <Transition name="fade">
      <button
        v-if="showBackToTop"
        type="button"
        class="back-to-top"
        aria-label="Retour en haut de la page"
        @click="scrollToTop"
      >
        <IconArrowUp class="back-to-top__icon" width="20" height="20" />
      </button>
    </Transition>

    <slot />
  </div>
</template>
