<script setup lang="ts">
import { ref } from 'vue'
import type { Component } from 'vue'
import type { DisplayContact, TelephoneApi } from '~/types/annuaire'
import IconPhone from '~/assets/icon/phone.svg?component'
import IconDevicePhoneMobile from '~/assets/icon/device-phone-mobile.svg?component'
import IconChatBubbleOvalLeftEllipsis from '~/assets/icon/chat-bubble-oval-left-ellipsis.svg?component'
import IconEnvelope from '~/assets/icon/envelope.svg?component'
import IconChevronDown from '~/assets/icon/chevron-down.svg?component'
import IconClock from '~/assets/icon/clock.svg?component'
import IconMapPin from '~/assets/icon/map-pin.svg?component'
import IconGlobeAlt from '~/assets/icon/globe-alt.svg?component'

const props = withDefaults(defineProps<{
  contact: DisplayContact
  color: string
  isNearest?: boolean
  expanded?: boolean
}>(), {
  isNearest: false,
  expanded: false,
})

const emit = defineEmits<{ toggle: [ref: string] }>()

const copiedField = ref<string | null>(null)

const telephoneIcons: Record<string, Component> = {
  mobile: IconDevicePhoneMobile,
  sms: IconChatBubbleOvalLeftEllipsis,
}

function telephoneIcon(type: TelephoneApi['type']) {
  return telephoneIcons[type] ?? IconPhone
}

function initials(name: string) {
  const words = name.split(/[\s—-]+/).filter(w => /^[A-Za-zÀ-ÿ]/.test(w))
  return words.slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('')
}

function toggleExpanded() {
  emit('toggle', props.contact.ref)
}

function telephoneHref(telephone: TelephoneApi) {
  const numero = telephone.numero.replace(/\s/g, '')
  return telephone.type === 'sms' ? `sms:${numero}` : `tel:${numero}`
}

function websiteHref(url: string) {
  const trimmed = url.trim()
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

function websiteLabel(url: string) {
  return websiteHref(url).replace(/^https?:\/\//i, '').replace(/\/$/, '')
}

async function copy(text: string, field: string) {
  await navigator.clipboard.writeText(text)
  copiedField.value = field
  setTimeout(() => {
    if (copiedField.value === field) copiedField.value = null
  }, 1500)
}
</script>

<template>
  <div
    class="contact-card" :class="{ 'contact-card--nearest': isNearest, 'contact-card--expanded': expanded }"
    :style="{ '--theme-color': color }">
    <span v-if="isNearest" class="contact-card__nearest-badge">Le plus proche</span>

    <div
      class="contact-card__row" role="button" tabindex="0" :aria-expanded="expanded"
      @click="toggleExpanded" @keydown.enter="toggleExpanded" @keydown.space.prevent="toggleExpanded">
      <div class="contact-card__avatar-init" aria-hidden="true">{{ initials(contact.name) }}</div>

      <div class="contact-card__text">
        <p class="contact-card__name">{{ contact.name }}</p>
      </div>

      <div class="contact-card__icon-actions">
        <a
          v-if="contact.telephones?.[0]" class="contact-card__icon-btn contact-card__icon-btn--phone"
          :href="telephoneHref(contact.telephones[0])" :aria-label="`Appeler ${contact.name}`" @click.stop>
          <IconPhone />
        </a>
        <a
          v-if="contact.email" class="contact-card__icon-btn contact-card__icon-btn--email"
          :href="`mailto:${contact.email}`" :aria-label="`Envoyer un email à ${contact.name}`" @click.stop>
          <IconEnvelope />
        </a>
      </div>

      <IconChevronDown class="contact-card__chevron" aria-hidden="true" />
    </div>

    <Transition name="cc-fade">
      <div v-if="expanded" class="contact-card__detail">
        <p v-if="contact.role" class="contact-card__detail-role">{{ contact.role }}</p>

        <p v-if="contact.hours" class="contact-card__detail-info">
          <IconClock class="detail-icon" />
          {{ contact.hours }}
        </p>

        <p v-if="contact.address" class="contact-card__detail-info">
          <IconMapPin class="detail-icon" />
          {{ contact.address }}
        </p>

        <a
          v-if="contact.website" class="contact-card__detail-info contact-card__detail-info--link"
          :href="websiteHref(contact.website)" target="_blank" rel="noopener noreferrer">
          <IconGlobeAlt class="detail-icon" />
          <span class="contact-card__detail-info-text">{{ websiteLabel(contact.website) }}</span>
        </a>

        <div
v-if="contact.telephones.length" class="contact-card__phones"
          :class="{ 'contact-card__phones--grid': contact.telephones.length > 2 }">
          <div
v-for="telephone in contact.telephones" :key="telephone.numero"
            class="contact-card__detail-row">
            <span class="contact-card__detail-value-wrap">
              <component :is="telephoneIcon(telephone.type)" class="detail-icon" />
              <span class="contact-card__detail-value">
                {{ telephone.numero }}
                <span v-if="telephone.libelle" class="contact-card__toll-free">{{ telephone.libelle }}</span>
                <span v-if="telephone.numero_vert" class="contact-card__toll-free" title="Numéro vert — appel gratuit">Numéro vert</span>
              </span>
            </span>
            <button
type="button" class="contact-card__copy-btn"
              :class="{ 'contact-card__copy-btn--copied': copiedField === telephone.numero }"
              @click.stop="copy(telephone.numero, telephone.numero)">
              {{ copiedField === telephone.numero ? 'Copié' : 'Copier' }}
            </button>
          </div>
        </div>

        <div v-if="contact.email" class="contact-card__detail-row">
          <span class="contact-card__detail-value-wrap">
            <IconEnvelope class="detail-icon" />
            <span class="contact-card__detail-value">{{ contact.email }}</span>
          </span>
          <button
type="button" class="contact-card__copy-btn" :class="{ 'contact-card__copy-btn--copied': copiedField === 'email' }"
            @click.stop="copy(contact.email, 'email')">
            {{ copiedField === 'email' ? 'Copié' : 'Copier' }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
