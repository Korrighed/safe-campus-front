<script setup lang="ts">
import logoSf from '~/assets/images/logoSf.svg?url'
import universImg from '~/assets/images/univers.png'

definePageMeta({ layout: 'default' })

// Requete partagee avec le menu global (layout) : voir composables/useThemes.
const { themes } = await useThemes()
</script>

<template>
  <div class="home">

    <!-- Header + recherche + hero -->
    <div class="above-fold">
      <header class="home-header">
        <div class="home-brand">
          <img :src="logoSf" alt="Safe Campus" class="header-logo" >
        </div>

        <SearchBar class="home-search" :themes="themes" />
      </header>

      <div class="home-hero">
        <img :src="universImg" alt="Campus UNC" class="hero-img" >
        <div class="hero-overlay" />
      </div>
    </div>

    <!-- Section intro -->
    <section id="about" class="home-intro">
      <img :src="logoSf" alt="Logo Safe Campus" class="intro-logo" >
      <p class="intro-subtitle">C'est quoi&nbsp;?</p>
      <p class="intro-body">
        Safe Campus, c'est une application pensée pour les étudiants de l'Université de Nouvelle-Calédonie.
        Elle centralise les informations, les ressources et les contacts utiles sur les conduites addictives,
        la santé mentale et les violences sur le campus.
      </p>
    </section>

    <!-- Sections thématiques -->
    <main class="home-sections">
      <ThemeSection
        v-for="theme in themes"
        :id="`theme-${theme.id}`"
        :key="theme.id"
        :theme="theme"
      />
    </main>

    <!-- Footer -->
    <SiteFooter />

  </div>
</template>
