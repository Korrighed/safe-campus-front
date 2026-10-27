<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick, watch } from 'vue'
import type * as Leaflet from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { LocatedContact } from '~/types/annuaire'
import IconViewfinderCircle from '~/assets/icon/viewfinder-circle.svg?component'
import IconArrowPath from '~/assets/icon/arrow-path.svg?component'
import IconArrowsPointingOut from '~/assets/icon/arrows-pointing-out.svg?component'
import IconXMark from '~/assets/icon/x-mark.svg?component'

const props = defineProps<{
  contacts: LocatedContact[]
  color: string
}>()

// ref du contact le plus proche, remontee a la page (reordonne la liste des cartes).
const nearest = defineModel<string | null>('nearest', { default: null })

const mapContainer = ref<HTMLElement | null>(null)
const geoError = ref<string | null>(null)
const geoLoading = ref(false)
const userLocated = ref(false)
// Carte affichee en plein ecran (overlay) plutot que dans la colonne de droite.
const expanded = ref(false)

let L: typeof Leaflet | null = null
let map: Leaflet.Map | null = null
let userMarker: Leaflet.Marker | null = null

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

async function initMap() {
  if (map || !mapContainer.value || props.contacts.length === 0) return

  if (!L) {
    L = (await import('leaflet')).default
  }

  const leaflet = L
  const currentMap = leaflet.map(mapContainer.value, { zoomControl: true, scrollWheelZoom: false })
  map = currentMap

  leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 19,
  }).addTo(currentMap)

  props.contacts.forEach(contact => {
    const icon = leaflet.divIcon({
      className: '',
      html: `<div style="width:16px;height:16px;background:${props.color};border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.35);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    })
    const popupContent = document.createElement('div')
    const popupName = document.createElement('strong')
    popupName.textContent = contact.name
    popupContent.append(popupName, document.createElement('br'), contact.telephones[0]?.numero ?? contact.email ?? '')

    leaflet.marker([contact.lat, contact.lng], { icon })
      .addTo(currentMap)
      .bindPopup(popupContent)
  })

  fitToContacts()

  setTimeout(() => currentMap.invalidateSize(), 350)
}

function fitToContacts() {
  if (!L || !map) return

  if (props.contacts.length > 1) {
    map.fitBounds(L.latLngBounds(props.contacts.map(c => [c.lat, c.lng])), { padding: [32, 32] })
  } else if (props.contacts[0]) {
    map.setView([props.contacts[0].lat, props.contacts[0].lng], 14)
  }
}

function locateMe() {
  geoError.value = null

  if (!navigator.geolocation) {
    geoError.value = "La géolocalisation n'est pas disponible sur cet appareil."
    return
  }

  geoLoading.value = true

  navigator.geolocation.getCurrentPosition(
    (position) => {
      geoLoading.value = false
      if (!map || !L) return

      const { latitude, longitude } = position.coords

      const firstContact = props.contacts[0]
      if (!firstContact) return

      let nearestContact = firstContact
      let minDist = distanceKm(latitude, longitude, nearestContact.lat, nearestContact.lng)
      for (const contact of props.contacts.slice(1)) {
        const dist = distanceKm(latitude, longitude, contact.lat, contact.lng)
        if (dist < minDist) { minDist = dist; nearestContact = contact }
      }
      nearest.value = nearestContact.ref
      userLocated.value = true

      if (userMarker) {
        userMarker.setLatLng([latitude, longitude])
      } else {
        // Couleur et forme volontairement distinctes des marqueurs contacts
        // (qui reprennent la couleur du theme, un bleu proche) : halo pulsant
        // + pastille rose. Styles dans main.css (.user-marker).
        const userIcon = L.divIcon({
          className: 'user-marker',
          html: '<span class="user-marker__pulse"></span><span class="user-marker__dot"></span>',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        })
        userMarker = L.marker([latitude, longitude], { icon: userIcon }).addTo(map).bindPopup('Votre position')
      }

      map.fitBounds(L.latLngBounds([[latitude, longitude], [nearestContact.lat, nearestContact.lng]]), { padding: [48, 48] })
    },
    (err) => {
      geoLoading.value = false
      if (err.code === err.PERMISSION_DENIED) {
        geoError.value = 'Accès à la position refusé. Autorise la géolocalisation pour voir le contact le plus proche.'
      } else if (err.code === err.TIMEOUT) {
        geoError.value = 'La localisation a pris trop de temps, réessaie.'
      } else {
        geoError.value = 'Impossible de récupérer ta position pour le moment.'
      }
    },
    { enableHighAccuracy: true, timeout: 10000 },
  )
}

function resetGeoloc() {
  geoError.value = null
  userLocated.value = false
  nearest.value = null

  if (userMarker) {
    userMarker.remove()
    userMarker = null
  }

  fitToContacts()
}

function toggleExpanded() {
  expanded.value = !expanded.value
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && expanded.value) toggleExpanded()
}

// Le conteneur change de taille (colonne -> plein ecran) : Leaflet doit
// recalculer ses dimensions une fois la transition CSS terminee.
watch(expanded, async (open) => {
  if (import.meta.client) document.body.style.overflow = open ? 'hidden' : ''
  await nextTick()
  setTimeout(() => {
    map?.invalidateSize()
    fitToContacts()
  }, 260)
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  nextTick(() => setTimeout(initMap, 350))
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
  if (map) { map.remove(); map = null }
})
</script>

<template>
  <!-- Teleporte en plein ecran quand la carte est agrandie ; conserve le
       meme noeud DOM (et donc l'instance Leaflet) grace a :disabled. -->
  <Teleport to="body" :disabled="!expanded">
    <div class="cp-location-wrap" :class="{ 'cp-location-wrap--expanded': expanded }">
      <div v-if="expanded" class="cp-location-backdrop" @click="toggleExpanded" />

      <section class="cp-location" :class="{ 'cp-location--expanded': expanded }">
        <div class="cp-location-head">
          <span class="cp-location-title">Où trouver de l'aide près de chez vous</span>
          <button
            type="button" class="btn-locate" :class="{ 'btn-locate--active': userLocated }" :disabled="geoLoading"
            @click="userLocated ? resetGeoloc() : locateMe()">
            <IconViewfinderCircle v-if="!userLocated" />
            <IconArrowPath v-else />
            {{ geoLoading ? 'Recherche…' : (userLocated ? 'Réinitialiser' : 'Me géolocaliser') }}
          </button>
        </div>

        <div class="cp-location-body">
          <div ref="mapContainer" class="cp-location-map" />
          <button
            type="button" class="cp-map-expand"
            :aria-label="expanded ? 'Réduire la carte' : 'Agrandir la carte'"
            @click="toggleExpanded">
            <IconArrowsPointingOut v-if="!expanded" />
            <IconXMark v-else />
          </button>
        </div>

        <p v-if="geoError" class="cp-geo-error">{{ geoError }}</p>
      </section>
    </div>
  </Teleport>
</template>
