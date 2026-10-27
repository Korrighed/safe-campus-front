<script setup lang="ts">
import { ref } from 'vue'
import type { ThemeItemView, ThemeView } from '~/types/annuaire'
import IconArrowLeft from '~/assets/icon/arrow-left.svg?component'
import IconXMark from '~/assets/icon/x-mark.svg?component'
import IconChevronRight from '~/assets/icon/chevron-right.svg?component'
import IconArrowRight from '~/assets/icon/arrow-right.svg?component'

withDefaults(defineProps<{
  themes?: ThemeView[]
  modelValue: boolean
}>(), {
  themes: () => [],
})

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const route = useRoute()

const activeTheme = ref<ThemeView | null>(null)
const activeItem = ref<ThemeItemView | null>(null)

function close() {
  emit('update:modelValue', false)
  setTimeout(() => { activeTheme.value = null; activeItem.value = null }, 320)
}

function goToTheme(theme: ThemeView) {
  activeTheme.value = theme
}

function goToItem(item: ThemeItemView) {
  activeItem.value = item
}

function goBack() {
  if (activeItem.value) {
    activeItem.value = null
  } else {
    activeTheme.value = null
  }
}

// Le drawer est disponible sur toutes les pages : si on n'est pas sur
// l'accueil, on y navigue d'abord puis on attend que la section soit rendue.
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

async function scrollToSection(selector: string) {
  close()
  if (route.path !== '/') {
    await navigateTo('/')
  }
  scrollWhenReady(selector)
}

function scrollToTheme(themeId: string) {
  scrollToSection(`#theme-${themeId}`)
}

function openPage(path: 'contact' | 'ressources' | 'histoire') {
  if (!activeTheme.value || !activeItem.value) return
  navigateTo(`/${path}/${activeTheme.value.id}/${activeItem.value.slug}`)
  close()
}

function scrollToIntro() {
  scrollToSection('.home-intro')
}

function goToLegal(path: '/mentions-legales' | '/cgu' | '/donnees-personnelles') {
  close()
  navigateTo(path)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="drawer-backdrop" @click="close" />
    </Transition>

    <Transition name="drawer-slide">
      <div v-if="modelValue" class="drawer" role="dialog" aria-modal="true" aria-label="Menu de navigation">

        <!-- En-tête du drawer -->
        <div class="drawer-head">
          <Transition name="head-swap" mode="out-in">
            <button v-if="activeTheme" key="back" class="drawer-back" @click="goBack">
              <IconArrowLeft width="16" height="16" />
              Retour
            </button>
            <span v-else key="title" class="drawer-title">MENU</span>
          </Transition>

          <button class="drawer-close" aria-label="Fermer le menu" @click="close">
            <IconXMark width="18" height="18" />
          </button>
        </div>

        <!-- Corps du drawer -->
        <div class="drawer-body">
          <Transition name="level" mode="out-in">

            <!-- Niveau 1 : liste des thèmes -->
            <nav v-if="!activeTheme" key="themes">
              <p class="drawer-section-label">Thématiques</p>
              <ul class="drawer-list">
                <li
                  v-for="theme in themes"
                  :key="theme.id"
                  class="drawer-item"
                  @click="goToTheme(theme)"
                >
                  <span class="item-dot" :style="{ background: theme.color }" />
                  <span class="item-label">{{ theme.label }}</span>
                  <span class="item-count">{{ theme.items.length }}</span>
                  <IconChevronRight class="item-chevron" width="16" height="16" />
                </li>
              </ul>

              <div class="drawer-divider" />

              <p class="drawer-section-label">Informations</p>
              <ul class="drawer-list">
                <li class="drawer-item drawer-item--secondary" @click="scrollToIntro">
                  <span class="item-label">À propos de Safe Campus</span>
                  <IconChevronRight class="item-chevron" width="16" height="16" />
                </li>
                <li class="drawer-item drawer-item--secondary" @click="goToLegal('/mentions-legales')">
                  <span class="item-label">Mentions légales</span>
                  <IconChevronRight class="item-chevron" width="16" height="16" />
                </li>
                <li class="drawer-item drawer-item--secondary" @click="goToLegal('/cgu')">
                  <span class="item-label">CGU</span>
                  <IconChevronRight class="item-chevron" width="16" height="16" />
                </li>
                <li class="drawer-item drawer-item--secondary" @click="goToLegal('/donnees-personnelles')">
                  <span class="item-label">Données personnelles</span>
                  <IconChevronRight class="item-chevron" width="16" height="16" />
                </li>
              </ul>
            </nav>

            <!-- Niveau 2 : sous-thèmes -->
            <nav v-else-if="!activeItem" key="items">
              <div class="sublevel-head" :style="{ '--theme-c': activeTheme.color }">
                <span class="sublevel-label">{{ activeTheme.label }}</span>
              </div>

              <ul class="drawer-list">
                <li
                  v-for="item in activeTheme.items"
                  :key="item.id"
                  class="drawer-item drawer-item--sub"
                  @click="goToItem(item)"
                >
                  <div class="sub-item-content">
                    <span class="item-label">{{ item.title }}</span>
                    <span class="item-subtitle">{{ item.subtitle }}</span>
                  </div>
                  <IconChevronRight class="item-chevron" width="16" height="16" />
                </li>
              </ul>

              <button class="sublevel-all-btn" @click="scrollToTheme(activeTheme.id)">
                Voir toute la section
                <IconArrowRight width="14" height="14" />
              </button>
            </nav>

            <!-- Niveau 3 : Contact ou Ressources -->
            <nav v-else key="pages">
              <div class="sublevel-head" :style="{ '--theme-c': activeTheme.color }">
                <span class="sublevel-label">{{ activeItem.title }}</span>
              </div>

              <ul class="drawer-list">
                <li class="drawer-item drawer-item--sub" @click="openPage('contact')">
                  <span class="item-label">Contact</span>
                  <IconChevronRight class="item-chevron" width="16" height="16" />
                </li>
                <li class="drawer-item drawer-item--sub" @click="openPage('ressources')">
                  <span class="item-label">Ressources</span>
                  <IconChevronRight class="item-chevron" width="16" height="16" />
                </li>
                <li v-if="activeItem.histoireRef" class="drawer-item drawer-item--sub" @click="openPage('histoire')">
                  <span class="item-label">Histoire</span>
                  <IconChevronRight class="item-chevron" width="16" height="16" />
                </li>
              </ul>
            </nav>

          </Transition>
        </div>

        <!-- Pied de page -->
        <div class="drawer-footer">
          <span>Safe Campus · UNC 2026</span>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>
