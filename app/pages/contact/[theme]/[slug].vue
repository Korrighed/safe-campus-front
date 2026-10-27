<script setup lang="ts">
import { computed, ref } from 'vue'
import { sousThemeNinjas, themePresentation } from '~/data/presentation'
import type { SousThemeDetailApi } from '~/types/annuaire'

definePageMeta({ layout: 'default' })

const route = useRoute()

const apiBase = useApiBase()
// Cle explicite et stable : useApiBase() renvoie une URL differente au SSR
// (sc_back) et au client (localhost), donc la cle auto-generee par useFetch
// differerait entre les deux -> le payload SSR ne serait pas reutilise a
// l'hydratation, provoquant un refetch client et un mismatch d'hydratation.
const { data: response, error: fetchError } = await useFetch<{ data: SousThemeDetailApi }>(
  `${apiBase}/api/sous-themes/${route.params.slug}`,
  { key: `sous-theme:${route.params.slug}` },
)

if (fetchError.value || !response.value?.data) {
  throw createError({ statusCode: 404, statusMessage: 'Ressource introuvable' })
}

const sousTheme = response.value.data

const theme = {
  color: themePresentation[sousTheme.theme.ref]?.color ?? '#4260e6',
  shortLabel: sousTheme.theme.libelle_court,
}

const item = {
  title: sousTheme.libelle,
  description: sousTheme.article,
  ninja: sousThemeNinjas[sousTheme.ref],
  contacts: toDisplayContacts(sousTheme.contacts),
  histoires: sousTheme.histoires,
}

useHead({ title: item.title })

const locatedContacts = item.contacts.filter(isLocated)
const hasLocated = locatedContacts.length > 0

const nearestContactRef = ref<string | null>(null)
const expandedContactRef = ref<string | null>(null)

function toggleExpandedContact(ref: string) {
  expandedContactRef.value = expandedContactRef.value === ref ? null : ref
}

const sortedContacts = computed(() => {
  if (!nearestContactRef.value) return item.contacts
  const nearest = item.contacts.find(c => c.ref === nearestContactRef.value)
  if (!nearest) return item.contacts
  return [nearest, ...item.contacts.filter(c => c.ref !== nearestContactRef.value)]
})

</script>

<template>
  <div class="cp-page" :style="{ '--theme-color': theme.color }">

    <!-- Hero : ninja + titre, centrés en haut de page -->
    <section class="cp-hero">
      <div class="cp-hero-ninja-wrap">
        <img :src="item.ninja" :alt="item.title" class="cp-hero-ninja" >
      </div>
      <span class="cp-tag">{{ theme.shortLabel }}</span>
      <h1 class="cp-title">{{ item.title }}</h1>
    </section>

    <!-- Texte (gauche) + carte carrée (droite) sur desktop -->
    <div class="cp-main">
      <div class="cp-intro">
        <p class="cp-description">{{ item.description }}</p>
        <div v-if="item.histoires.length" class="cp-hero-actions">
          <NuxtLink
            :to="{ path: `/histoire/${route.params.theme}/${route.params.slug}`, query: { retour: route.path } }"
            class="btn-story"
          >
            Suivre l'histoire
          </NuxtLink>
        </div>
      </div>

      <!-- Localisation : carte navigateur uniquement, hors du rendu serveur -->
      <ClientOnly v-if="hasLocated">
        <ContactMap
          v-model:nearest="nearestContactRef"
          :contacts="locatedContacts"
          :color="theme.color"
        />
        <template #fallback>
          <div class="cp-location-wrap">
            <section class="cp-location">
              <div class="cp-location-body">
                <div class="cp-location-map" />
              </div>
            </section>
          </div>
        </template>
      </ClientOnly>
    </div>

    <div class="cp-content">

      <!-- Contacts -->
      <section class="cp-contacts">
        <p class="section-label">Contact</p>
        <div class="cp-contacts-grid">
          <ContactCard
v-for="contact in sortedContacts" :key="contact.ref" :contact="contact" :color="theme.color"
            :is-nearest="contact.ref === nearestContactRef" :expanded="contact.ref === expandedContactRef"
            @toggle="toggleExpandedContact" />
        </div>
      </section>

    </div>

    <SiteFooter />
  </div>
</template>
