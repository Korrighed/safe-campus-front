<script setup lang="ts">
definePageMeta({ layout: 'default' })
</script>

<template>
  <div class="legal-page">
    <div class="legal-page__content">
      <h1 class="legal-page__title">Données personnelles</h1>
      <p class="legal-page__updated">Dernière mise à jour : 26 octobre 2026</p>

      <section class="legal-page__section">
        <h2 class="legal-page__section-title">En résumé</h2>
        <p>
          Safe Campus ne crée aucun compte nominatif pour les visiteurs, ne propose aucun
          formulaire et n'utilise aucun outil de mesure d'audience. Quelques données techniques
          circulent malgré tout : elles sont détaillées ci-dessous, avec leur durée de
          conservation.
        </p>
        <p>
          Pendant la phase de prototype, un accès par mot de passe partagé limite l'entrée au site
          lors des événements. Ce portillon sera retiré à la mise en production officielle : ce qui
          le concerne ci-dessous disparaîtra alors.
        </p>
        <p>
          Le responsable de traitement (l'Université de la Nouvelle-Calédonie, à confirmer) et les
          bases légales sont en cours de validation par le délégué·e à la protection des données
          (DPO) de l'UNC. Voir les <NuxtLink to="/mentions-legales">mentions légales</NuxtLink>.
        </p>
      </section>

      <section class="legal-page__section">
        <h2 class="legal-page__section-title">Données traitées pour les visiteurs</h2>
        <div class="legal-page__table-wrap">
          <table class="legal-page__table">
            <thead>
              <tr>
                <th scope="col">Traitement</th>
                <th scope="col">Données</th>
                <th scope="col">Finalité</th>
                <th scope="col">Durée de conservation</th>
                <th scope="col">Base légale</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Accès au site (portillon visiteur, prototype uniquement)</th>
                <td>Cookie <code>sc_token</code>. Aucune donnée identifiante : le compte est partagé.</td>
                <td>Restreindre l'accès au prototype pendant les événements. Retiré à la mise en production.</td>
                <td>Durée de la session du navigateur.</td>
                <td>Intérêt légitime, à valider par le DPO.</td>
              </tr>
              <tr>
                <th scope="row">Polices de caractères (Google Fonts)</th>
                <td>Adresse IP et en-têtes HTTP, transmises à Google.</td>
                <td>Afficher les polices du site.</td>
                <td>Non conservées par Safe Campus. Durée fixée par Google.</td>
                <td>À confirmer par le DPO.</td>
              </tr>
              <tr>
                <th scope="row">Cartes (OpenStreetMap)</th>
                <td>Adresse IP et zone de carte consultée, transmises à OpenStreetMap.</td>
                <td>Afficher la carte des structures d'aide.</td>
                <td>Non conservées par Safe Campus. Durée fixée par OpenStreetMap.</td>
                <td>À confirmer par le DPO.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Le serveur d'hébergement peut aussi journaliser l'adresse IP des visiteurs. L'hébergeur
          n'est pas encore choisi : cette durée sera indiquée ici une fois connue.
        </p>
      </section>

      <section class="legal-page__section">
        <h2 class="legal-page__section-title">Cookie et traceurs</h2>
        <p>
          Pendant le prototype, le seul cookie déposé est <code>sc_token</code>. Il sert uniquement
          au portillon d'accès et disparaît à la fermeture du navigateur. Il sera supprimé avec le
          portillon à la mise en production. Safe Campus n'utilise aucun cookie publicitaire ni de
          mesure d'audience.
        </p>
      </section>

      <section class="legal-page__section">
        <h2 class="legal-page__section-title">Services tiers</h2>
        <p>
          Google Fonts et OpenStreetMap reçoivent l'adresse IP de votre navigateur lorsque vous
          consultez le site, comme tout serveur auquel un navigateur se connecte. Ils appliquent
          leurs propres règles de confidentialité, sur lesquelles Safe Campus n'a pas de prise.
        </p>
      </section>

      <section class="legal-page__section">
        <h2 class="legal-page__section-title">Référents nommés de l'annuaire</h2>
        <p>
          L'annuaire affiche, pour certaines structures, le nom, le prénom, l'adresse mail
          professionnelle et l'adresse de permanence d'un·e référent·e. Ces données sont conservées
          tant que la personne est en poste. Elle peut en demander l'effacement à tout moment.
        </p>
      </section>

      <section class="legal-page__section">
        <h2 class="legal-page__section-title">Vos droits</h2>
        <p>
          Vous pouvez demander l'accès à vos données, leur rectification, leur effacement, ou vous
          opposer à leur traitement ou en demander la limitation. Écrivez au délégué·e à la
          protection des données de l'UNC : <a href="mailto:dpo@unc.nc">dpo@unc.nc</a>. La demande
          est traitée dans un délai d'un mois.
        </p>
        <p>
          En cas de désaccord, vous pouvez saisir l'autorité de contrôle compétente. Le régime
          juridique exact applicable en Nouvelle-Calédonie est en cours de confirmation par le DPO
          de l'UNC.
        </p>
      </section>
    </div>

    <SiteFooter />
  </div>
</template>
