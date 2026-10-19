<script setup lang="ts">
definePageMeta({ layout: 'default' })
</script>

<template>
  <div class="legal-page">
    <div class="legal-page__content">
      <h1 class="legal-page__title">Conditions générales d'utilisation</h1>
      <p class="legal-page__updated">Dernière mise à jour : 28 septembre 2026</p>

      <section class="legal-page__section">
        <h2 class="legal-page__section-title">Objet</h2>
        <p>
          Les présentes conditions générales d'utilisation (CGU) encadrent l'accès et l'usage de
          Safe Campus, une application d'information et d'orientation sur les conduites
          addictives, la santé mentale et les violences sur le campus. Le site s'adresse en
          priorité aux étudiants de l'Université de la Nouvelle-Calédonie, mais son accès est
          public.
        </p>
      </section>

      <section class="legal-page__section">
        <h2 class="legal-page__section-title">Statut du site</h2>
        <p>
          Safe Campus est actuellement un prototype développé dans le cadre d'un projet
          universitaire (SAE501). Le contenu, les fonctionnalités et les présentes CGU sont
          susceptibles d'évoluer avant une éventuelle mise en production officielle.
        </p>
      </section>

      <section class="legal-page__section">
        <h2 class="legal-page__section-title">Accès au service</h2>
        <p>
          L'accès au site se fait actuellement via un compte visiteur unique et partagé, sans
          création de compte individuel ni collecte d'identité. Cet accès est fourni à titre
          d'information et ne constitue pas un service d'urgence.
        </p>
      </section>

      <section class="legal-page__section">
        <h2 class="legal-page__section-title">Contenu et limites de responsabilité</h2>
        <p>
          Les informations et ressources présentées sur Safe Campus ont une visée informative et
          d'orientation. Elles ne remplacent en aucun cas un avis médical, psychologique ou
          juridique professionnel. En cas d'urgence, contactez directement les services compétents
          listés dans l'annuaire du site.
        </p>
      </section>

      <section class="legal-page__section">
        <h2 class="legal-page__section-title">Contenu et propriété intellectuelle</h2>
        <p>
          Une grande partie des informations diffusées sur Safe Campus provient de sources
          publiques déjà accessibles en ligne ; le site ne revendique aucun droit exclusif sur ce
          contenu informatif. Seuls les éléments propres au site (code, design, illustrations
          originales) sont protégés par le droit d'auteur. Voir les
          <NuxtLink to="/mentions-legales">mentions légales</NuxtLink>.
        </p>
      </section>

      <section class="legal-page__section">
        <h2 class="legal-page__section-title">Modification des CGU</h2>
        <p>
          Ces conditions peuvent être modifiées à tout moment, notamment à l'approche d'une mise
          en production officielle du site.
        </p>
      </section>
    </div>

    <SiteFooter />
  </div>
</template>
