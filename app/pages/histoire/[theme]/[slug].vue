<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ChoixApi, HistoireApi, SousThemeDetailApi } from '~/types/annuaire'
import type { HistoirePageState } from '~/types/histoire'
import IconArrowLeft from '~/assets/icon/arrow-left.svg?component'
import IconArrowPath from '~/assets/icon/arrow-path.svg?component'

definePageMeta({ layout: 'default' })

const route = useRoute()
const apiBase = useApiBase()

// Meme endpoint que /contact et /ressources : la page navigue par theme/slug de
// sous-theme, pas par ref d'histoire, pour rester coherente avec le reste du site.
const { data: sousThemeResponse, error: sousThemeError } = await useFetch<{ data: SousThemeDetailApi }>(
  `${apiBase}/api/sous-themes/${route.params.slug}`,
  { key: `histoire-page:sous-theme:${route.params.slug}` },
)

if (sousThemeError.value || !sousThemeResponse.value?.data) {
  throw createError({ statusCode: 404, statusMessage: 'Rubrique introuvable' })
}

const sousTheme = sousThemeResponse.value.data
const histoireRef = sousTheme.histoires[0]?.ref ?? null

// Deuxieme appel seulement si le sous-theme a deja une histoire rattachee :
// sinon la page affiche un placeholder, sans graphe a charger.
let histoire: HistoireApi | null = null

if (histoireRef) {
  const { data: histoireResponse } = await useFetch<{ data: HistoireApi }>(
    `${apiBase}/api/histoires/${histoireRef}`,
    { key: `histoire-page:histoire:${histoireRef}` },
  )
  histoire = histoireResponse.value?.data ?? null
}

const state: HistoirePageState = histoire
  ? { status: 'ready', histoire, scenesParId: new Map(histoire.scenes.map(scene => [scene.id, scene])) }
  : { status: 'placeholder' }

useHead({ title: state.status === 'ready' ? state.histoire.titre : sousTheme.libelle })

const color = '#4260e6'

// Page d'ou l'on vient (?retour=/contact/...). Chemin interne uniquement,
// sinon un lien forge redirigerait hors du site.
const retour = computed(() => {
  const chemin = route.query.retour
  return typeof chemin === 'string' && chemin.startsWith('/') && !chemin.startsWith('//') ? chemin : '/'
})

const sceneId = ref<number | null>(state.status === 'ready' ? state.histoire.scene_initiale_id : null)
const choixFinal = ref<ChoixApi | null>(null)
const expandedContactRef = ref<string | null>(null)

const scene = computed(() => {
  if (state.status !== 'ready' || sceneId.value === null) return null
  return state.scenesParId.get(sceneId.value) ?? null
})
const contacts = computed(() => toDisplayContacts(choixFinal.value?.contacts ?? []))

const finLabels = {
  favorable: 'Bonne décision',
  defavorable: 'Cette décision peut te mettre en danger',
}

const finLabel = computed(() => {
  const issue = choixFinal.value?.issue
  return issue ? finLabels[issue] : "Fin de l'histoire"
})

function choisir(choix: ChoixApi) {
  if (state.status !== 'ready') return

  const suivante = choix.next_scene_id === null ? null : state.scenesParId.get(choix.next_scene_id)

  if (suivante) {
    sceneId.value = suivante.id
    return
  }

  choixFinal.value = choix
  sceneId.value = null
}

function recommencer() {
  sceneId.value = state.status === 'ready' ? state.histoire.scene_initiale_id : null
  choixFinal.value = null
  expandedContactRef.value = null
}

function toggleExpandedContact(contactRef: string) {
  expandedContactRef.value = expandedContactRef.value === contactRef ? null : contactRef
}
</script>

<template>
  <div class="cp-page histoire">
    <section class="cp-hero">
      <span class="cp-tag">{{ sousTheme.theme.libelle_court }}</span>
      <h1 class="cp-title">{{ state.status === 'ready' ? state.histoire.titre : sousTheme.libelle }}</h1>
    </section>

    <div class="histoire__content">
      <!-- Aucune histoire rattachee a ce sous-theme pour l'instant. -->
      <article v-if="state.status === 'placeholder'" class="histoire__card">
        <p class="histoire__note">Cette histoire n'est pas encore disponible.</p>
        <p class="histoire__note">Reviens bientôt.</p>
      </article>

      <div v-else class="histoire__stage" aria-live="polite">
        <article v-if="scene" :key="scene.id" class="histoire__card">
          <img
            v-if="scene.media?.url"
            :src="scene.media.url"
            :alt="scene.media.libelle"
            class="histoire__image"
          >
          <p class="histoire__dialogue">{{ scene.dialogue_text }}</p>

          <ul v-if="scene.choix.length" class="histoire__choix">
            <li v-for="choix in scene.choix" :key="choix.id">
              <button type="button" class="histoire__choix-btn" @click="choisir(choix)">
                {{ choix.text_choix }}
              </button>
            </li>
          </ul>
          <div v-else class="histoire__actions">
            <p class="histoire__note">Cette scène n'a pas de suite.</p>
            <button type="button" class="btn-story" @click="recommencer">
              <IconArrowPath class="histoire__icon" aria-hidden="true" />
              Recommencer
            </button>
          </div>
        </article>

        <template v-else-if="choixFinal">
          <article
            class="histoire__card histoire__fin"
            :class="choixFinal.issue && `histoire__fin--${choixFinal.issue}`"
          >
            <p class="histoire__fin-label">{{ finLabel }}</p>
            <p class="histoire__dialogue">{{ choixFinal.text_choix }}</p>
            <div class="histoire__actions">
              <button type="button" class="btn-story" @click="recommencer">
                <IconArrowPath class="histoire__icon" aria-hidden="true" />
                Recommencer
              </button>
            </div>
          </article>

          <section v-if="contacts.length" class="histoire__aide">
            <p class="section-label">Des personnes peuvent t'aider</p>
            <div class="cp-contacts-grid">
              <ContactCard
                v-for="contact in contacts"
                :key="contact.ref"
                :contact="contact"
                :color="color"
                :expanded="contact.ref === expandedContactRef"
                @toggle="toggleExpandedContact"
              />
            </div>
          </section>
        </template>

        <article v-else class="histoire__card">
          <p class="histoire__note">Cette histoire n'a pas encore de début.</p>
        </article>
      </div>

      <NuxtLink :to="retour" class="histoire__quitter">
        <IconArrowLeft class="histoire__icon" aria-hidden="true" />
        Quitter l'histoire
      </NuxtLink>
    </div>

    <SiteFooter />
  </div>
</template>
