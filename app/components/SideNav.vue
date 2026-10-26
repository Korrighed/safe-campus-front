<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Component } from 'vue'
import type { ThemeItemView, ThemeView } from '~/types/annuaire'
import IconInformationCircle from '~/assets/icon/information-circle.svg?component'
import IconChevronRight from '~/assets/icon/chevron-right.svg?component'
import IconNoSymbol from '~/assets/icon/no-symbol.svg?component'
import IconHeart from '~/assets/icon/heart.svg?component'
import IconShieldCheck from '~/assets/icon/shield-check.svg?component'
import IconMagnifyingGlass from '~/assets/icon/magnifying-glass.svg?component'
import logoSf from '~/assets/images/logoSf.svg?url'
import SearchBar from '~/components/SearchBar.vue'

withDefaults(defineProps<{
  themes?: ThemeView[]
}>(), {
  themes: () => [],
})

const route = useRoute()

// Association thematique (ref API) → icone du rail.
const icons: Record<string, Component> = {
  addictions: IconNoSymbol,
  sante_mentale: IconHeart,
  vss: IconShieldCheck,
}

const search = ref<InstanceType<typeof SearchBar> | null>(null)

const hovering = ref(false)
const pinned = ref(false)
const isOpen = computed(() => hovering.value || pinned.value)

// Arbre : un theme deplie a la fois, un sous-theme deplie a la fois.
const openThemeId = ref<string | null>(null)
const openItemKey = ref<string | null>(null)

function itemKey(themeId: string, slug: string) {
  return `${themeId}/${slug}`
}

function toggleTheme(id: string) {
  openThemeId.value = openThemeId.value === id ? null : id
  openItemKey.value = null
}

function toggleItem(key: string) {
  openItemKey.value = openItemKey.value === key ? null : key
}

function onMouseEnter() {
  hovering.value = true
}

function onMouseLeave() {
  hovering.value = false
}

function closeAll() {
  pinned.value = false
  hovering.value = false
}

// Logo : retour accueil. Si on est déjà sur l'accueil, on recharge complètement
// la page ; sinon le NuxtLink gère la navigation.
function onLogoClick() {
  closeAll()
  if (route.path === '/') {
    window.location.reload()
  }
}

function onRailTheme(theme: ThemeView) {
  pinned.value = true
  toggleTheme(theme.id)
}

// La loupe du rail est alignée sur le champ de recherche du panneau : un clic
// ouvre le menu et place directement le curseur dans le champ.
function onRailSearch() {
  pinned.value = true
  nextTick(() => search.value?.focus())
}

// Ancre de la page d'accueil (#theme-xxx, #about). Depuis une autre page on
// navigue d'abord vers l'accueil, puis on attend que la section soit rendue.
function scrollWhenReady(selector: string, tries = 25) {
  const el = document.querySelector(selector)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    return
  }
  if (tries > 0) {
    requestAnimationFrame(() => scrollWhenReady(selector, tries - 1))
  }
}

async function goToSection(selector: string) {
  closeAll()
  if (route.path !== '/') {
    await navigateTo('/')
  }
  scrollWhenReady(selector)
}

function goToThemeSection(id: string) {
  goToSection(`#theme-${id}`)
}

function goToAbout() {
  goToSection('#about')
}

function goToLegal(path: '/mentions-legales' | '/cgu' | '/donnees-personnelles') {
  closeAll()
  navigateTo(path)
}

function goToPage(kind: 'contact' | 'ressources' | 'histoire', themeId: string, item: ThemeItemView) {
  closeAll()
  navigateTo(`/${kind}/${themeId}/${item.slug}`)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) closeAll()
}

function onDocClick(e: MouseEvent) {
  if (!pinned.value) return
  if (!(e.target as HTMLElement).closest('.sidenav')) closeAll()
}

watch(() => route.fullPath, closeAll)
watch(isOpen, (open) => {
  if (!open) {
    openThemeId.value = null
    openItemKey.value = null
  }
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('click', onDocClick)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('click', onDocClick)
})
</script>

<template>
  <div
    class="sidenav"
    :class="{ 'sidenav--open': isOpen }"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <!-- Rail d'icones, toujours visible -->
    <div class="sidenav__rail">
      <NuxtLink to="/" class="sidenav__logo" aria-label="Accueil Safe Campus" @click="onLogoClick">
        <img src="/assets/logoNinjaHead.png" alt="" >
      </NuxtLink>

      <!-- Aligné sur le champ de recherche du panneau -->
      <button
        type="button"
        class="sidenav__railbtn sidenav__railbtn--search"
        aria-label="Rechercher"
        @click="onRailSearch"
      >
        <IconMagnifyingGlass />
        <span class="sidenav__tip">Rechercher</span>
      </button>

      <nav class="sidenav__railnav" aria-label="Navigation thématique">
        <button
          v-for="theme in themes"
          :key="theme.id"
          type="button"
          class="sidenav__railbtn"
          :class="{ 'is-active': openThemeId === theme.id }"
          :style="{ '--c': theme.color }"
          :aria-label="theme.label"
          @click="onRailTheme(theme)"
        >
          <component :is="icons[theme.id] ?? IconInformationCircle" />
          <span class="sidenav__tip">{{ theme.shortLabel ?? theme.label }}</span>
        </button>

        <button
          type="button"
          class="sidenav__railbtn"
          aria-label="À propos"
          @click="goToAbout"
        >
          <IconInformationCircle />
          <span class="sidenav__tip">À propos</span>
        </button>
      </nav>
    </div>

    <!-- Panneau déplié -->
    <Transition name="sidenav-panel">
      <div v-show="isOpen" class="sidenav__panel" role="navigation" aria-label="Menu principal">
        <div class="sidenav__panel-head">
          <img :src="logoSf" alt="Safe Campus" class="sidenav__wordmark" >
        </div>

        <div class="sidenav__search">
          <SearchBar ref="search" :themes="themes" />
        </div>

        <div class="sidenav__scroll">
          <p class="sidenav__label">Thématiques</p>

          <ul class="sidenav__tree">
            <li v-for="theme in themes" :key="theme.id" class="sidenav__node">
              <div class="sidenav__row" :class="{ 'is-open': openThemeId === theme.id }">
                <button type="button" class="sidenav__rowmain" @click="goToThemeSection(theme.id)">
                  <span class="sidenav__dot" :style="{ background: theme.color }" />
                  <span class="sidenav__rowlabel">{{ theme.label }}</span>
                </button>
                <button
                  type="button"
                  class="sidenav__rowtoggle"
                  :aria-expanded="openThemeId === theme.id"
                  :aria-label="`Sous-thèmes ${theme.label}`"
                  @click="toggleTheme(theme.id)"
                >
                  <IconChevronRight width="15" height="15" />
                </button>
              </div>

              <Transition name="sidenav-sub">
                <ul v-show="openThemeId === theme.id" class="sidenav__subtree">
                  <li v-for="item in theme.items" :key="item.id" class="sidenav__node">
                    <button
                      type="button"
                      class="sidenav__row sidenav__row--sub"
                      :class="{ 'is-open': openItemKey === itemKey(theme.id, item.slug) }"
                      :aria-expanded="openItemKey === itemKey(theme.id, item.slug)"
                      @click="toggleItem(itemKey(theme.id, item.slug))"
                    >
                      <span class="sidenav__rowlabel">{{ item.title }}</span>
                      <IconChevronRight class="sidenav__rowchevron" width="14" height="14" />
                    </button>

                    <Transition name="sidenav-sub">
                      <div v-show="openItemKey === itemKey(theme.id, item.slug)" class="sidenav__leaf">
                        <button type="button" class="sidenav__leaflink" @click="goToPage('contact', theme.id, item)">
                          Contact
                        </button>
                        <button type="button" class="sidenav__leaflink" @click="goToPage('ressources', theme.id, item)">
                          Ressources
                        </button>
                        <button
                          v-if="item.histoireRef"
                          type="button"
                          class="sidenav__leaflink"
                          @click="goToPage('histoire', theme.id, item)"
                        >
                          Histoire
                        </button>
                      </div>
                    </Transition>
                  </li>
                </ul>
              </Transition>
            </li>
          </ul>

          <p class="sidenav__label">Informations</p>
          <ul class="sidenav__tree">
            <li class="sidenav__node">
              <button type="button" class="sidenav__rowmain sidenav__rowmain--solo" @click="goToAbout">
                <IconInformationCircle width="16" height="16" />
                <span class="sidenav__rowlabel">À propos de Safe Campus</span>
              </button>
            </li>
            <li class="sidenav__node">
              <button type="button" class="sidenav__rowmain sidenav__rowmain--solo" @click="goToLegal('/mentions-legales')">
                <IconInformationCircle width="16" height="16" />
                <span class="sidenav__rowlabel">Mentions légales</span>
              </button>
            </li>
            <li class="sidenav__node">
              <button type="button" class="sidenav__rowmain sidenav__rowmain--solo" @click="goToLegal('/cgu')">
                <IconInformationCircle width="16" height="16" />
                <span class="sidenav__rowlabel">CGU</span>
              </button>
            </li>
            <li class="sidenav__node">
              <button type="button" class="sidenav__rowmain sidenav__rowmain--solo" @click="goToLegal('/donnees-personnelles')">
                <IconShieldCheck width="16" height="16" />
                <span class="sidenav__rowlabel">Données personnelles</span>
              </button>
            </li>
          </ul>
        </div>

        <div class="sidenav__panel-foot">Safe Campus · UNC 2026</div>
      </div>
    </Transition>
  </div>
</template>
