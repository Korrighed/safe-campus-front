<script setup lang="ts">
import type { ThemeView } from '~/types/annuaire'

defineProps<{
  theme: ThemeView
}>()
</script>

<template>
  <section class="theme-section">
    <div class="section-header">
      <span class="section-bar" :style="{ backgroundColor: theme.color }"/>
      <h2 class="section-title">{{ theme.shortLabel }}</h2>
    </div>

    <CardSlider :items="theme.items" :color="theme.color" :theme-id="theme.id" />
  </section>
</template>
