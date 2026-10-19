<script setup lang="ts">
import { sousThemeNinjas, themePresentation } from '~/data/presentation'
import type { SousThemeDetailApi } from '~/types/annuaire'
import IconDocumentText from '~/assets/icon/document-text.svg?component'

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
  ninja: sousThemeNinjas[sousTheme.ref],
  intro: sousTheme.intro_ressources,
  documents: sousTheme.documents,
  histoires: sousTheme.histoires,
}

useHead({ title: `${item.title} — Ressources` })
</script>

<template>
  <div class="cp-page" :style="{ '--theme-color': theme.color }">

    <!-- Hero -->
    <section class="cp-hero">
      <div class="cp-hero-ninja-wrap">
        <img :src="item.ninja" :alt="item.title" class="cp-hero-ninja" >
      </div>
      <span class="cp-tag">{{ theme.shortLabel }}</span>
      <h1 class="cp-title">{{ item.title }}</h1>
      <p class="cp-description">{{ item.intro }}</p>
      <div v-if="item.histoires.length" class="cp-hero-actions">
        <NuxtLink
          :to="{ path: `/histoire/${route.params.theme}/${route.params.slug}`, query: { retour: route.path } }"
          class="btn-story"
        >
          Suivre l'histoire
        </NuxtLink>
      </div>
    </section>

    <div class="cp-content">

      <!-- Fiches réflectives -->
      <section v-if="item.documents.length" class="rp-documents">
        <p class="section-label">Fiches réflectives</p>
        <div class="rp-documents-grid">
          <div v-for="doc in item.documents" :key="doc.libelle" class="rp-document-card">
            <div class="rp-document-icon" aria-hidden="true">
              <IconDocumentText />
            </div>
            <div class="rp-document-body">
              <p class="rp-document-title">{{ doc.libelle }}</p>
              <p class="rp-document-desc">{{ doc.description }}</p>
            </div>
            <a
              v-if="doc.url"
              :href="doc.url"
              target="_blank"
              rel="noopener"
              class="btn-download"
            >
              Lire
            </a>
            <button v-else type="button" class="btn-download" disabled title="Bientôt disponible">
              Télécharger
            </button>
          </div>
        </div>
      </section>

    </div>

    <SiteFooter />
  </div>
</template>
