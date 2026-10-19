<script setup lang="ts">
definePageMeta({ layout: 'default' })
</script>

<template>
  <div class="legal-page">
    <div class="legal-page__content">
      <h1 class="legal-page__title">Mentions légales</h1>
      <p class="legal-page__updated">Dernière mise à jour : 20 octobre 2026</p>

      <section class="legal-page__section">
        <h2 class="legal-page__section-title">Statut du site</h2>
        <p>
          Safe Campus est un prototype réalisé dans le cadre de la SAE501 par des étudiants de
          l'Université de la Nouvelle-Calédonie (UNC). Il ne s'agit pas d'un service officiel en
          production : le contenu et les fonctionnalités sont susceptibles d'évoluer, et les
          informations ci-dessous seront mises à jour en cas de mise en production.
        </p>
      </section>

      <section class="legal-page__section">
        <h2 class="legal-page__section-title">Éditeur du site</h2>
        <p>
          Université de la Nouvelle-Calédonie (UNC)<br>
          Nouméa, Nouvelle-Calédonie
        </p>
      </section>

      <section class="legal-page__section">
        <h2 class="legal-page__section-title">Directeur de publication</h2>
        <p>
          Président·e de l'Université de la Nouvelle-Calédonie<br>
          Contact : <a href="mailto:president@unc.nc">president@unc.nc</a>
        </p>
      </section>

      <section class="legal-page__section">
        <h2 class="legal-page__section-title">Hébergement</h2>
        <p>
          Direction des systèmes d'information de l'Université de la Nouvelle-Calédonie<br>
          Nouméa, Nouvelle-Calédonie<br>
          Contact : <a href="mailto:dsi@unc.nc">dsi@unc.nc</a>
        </p>
      </section>

      <section class="legal-page__section">
        <h2 class="legal-page__section-title">Contenu et propriété intellectuelle</h2>
        <p>
          Une grande partie des informations diffusées sur Safe Campus (annuaire de contacts,
          ressources documentaires, informations générales sur les conduites addictives, la santé
          mentale et les violences) provient de sources publiques déjà accessibles en ligne. Safe
          Campus ne revendique aucun droit exclusif sur ce contenu informatif.
        </p>
        <p>
          Seuls les éléments propres au site (code source, design, illustrations originales,
          structure éditoriale) sont protégés au titre du droit d'auteur. Leur réutilisation sans
          autorisation préalable n'est pas autorisée.
        </p>
      </section>

      <section class="legal-page__section">
        <h2 class="legal-page__section-title">Données personnelles</h2>
        <p>
          Safe Campus ne collecte aucune donnée personnelle identifiante dans le cadre de son
          usage courant. Le compte d'accès visiteur est un compte partagé, non nominatif.
        </p>
        <p>
          Pour toute question relative aux données personnelles : délégué·e à la protection des
          données de l'UNC, <a href="mailto:dpo@unc.nc">dpo@unc.nc</a>.
        </p>
      </section>

      <section class="legal-page__section">
        <h2 class="legal-page__section-title">Contact</h2>
        <p>
          Responsable du projet Safe Campus :
          <a href="mailto:responsable-safe-campus@unc.nc">responsable-safe-campus@unc.nc</a>
        </p>
      </section>
    </div>

    <SiteFooter />
  </div>
</template>
