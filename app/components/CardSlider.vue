<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import type { ThemeItemView } from '~/types/annuaire'

const props = defineProps<{
  items: ThemeItemView[]
  color: string
  themeId: string
}>()

const currentIndex = ref(0)
const sliderEl = ref<HTMLElement | null>(null)

const touchStartX = ref(0)
const touchStartY = ref(0)
const isDragging = ref(false)

function onTouchStart(e: TouchEvent) {
  const touch = e.touches[0]
  if (!touch) return
  touchStartX.value = touch.clientX
  touchStartY.value = touch.clientY
  isDragging.value = true
}

function onTouchEnd(e: TouchEvent) {
  if (!isDragging.value) return
  isDragging.value = false
  const touch = e.changedTouches[0]
  if (!touch) return
  const dx = touch.clientX - touchStartX.value
  const dy = touch.clientY - touchStartY.value
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
    if (dx < 0) goNext()
    else goPrev()
  }
}

function onScroll() {
  if (!sliderEl.value) return
  const containerCenter = sliderEl.value.scrollLeft + sliderEl.value.offsetWidth / 2
  const cards = sliderEl.value.querySelectorAll<HTMLElement>('.card-item')
  let closest = 0
  let minDist = Infinity
  cards.forEach((card, i) => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2
    const dist = Math.abs(cardCenter - containerCenter)
    if (dist < minDist) { minDist = dist; closest = i }
  })
  currentIndex.value = closest
}

function goTo(index: number, behavior: ScrollBehavior = 'smooth') {
  currentIndex.value = index
  if (!sliderEl.value) return
  const cards = sliderEl.value.querySelectorAll<HTMLElement>('.card-item')
  const card = cards[index]
  if (!card) return
  const cardCenter = card.offsetLeft + card.offsetWidth / 2
  const containerCenter = sliderEl.value.offsetWidth / 2
  sliderEl.value.scrollTo({ left: cardCenter - containerCenter, behavior })
}

function goNext() {
  if (currentIndex.value < props.items.length - 1) goTo(currentIndex.value + 1)
}
function goPrev() {
  if (currentIndex.value > 0) goTo(currentIndex.value - 1)
}

onMounted(async () => {
  await nextTick()
  if (props.items.length > 1) {
    const mid = Math.floor(props.items.length / 2)
    currentIndex.value = mid
    goTo(mid, 'instant')
  }
})
</script>

<template>
  <div class="slider-wrapper">
    <div
ref="sliderEl" class="slider-track" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd"
      @scroll.passive="onScroll">
      <!-- Espaceur gauche pour permettre le centrage de la première carte -->
      <div class="slider-ghost" aria-hidden="true" />

      <CardItem v-for="item in items" :key="item.id" :item="item" :color="color" :theme-id="themeId" />

      <!-- Espaceur droit -->
      <div class="slider-ghost" aria-hidden="true" />
    </div>

    <div class="slider-dots" role="tablist" :aria-label="`Navigation ${themeId}`">
      <button
v-for="(item, i) in items" :key="item.id" class="dot" :class="{ active: i === currentIndex }"
        :style="i === currentIndex ? { background: color } : {}" role="tab" :aria-selected="i === currentIndex"
        :aria-label="`Carte ${i + 1} sur ${items.length}`" @click="goTo(i)" />
    </div>
  </div>
</template>
