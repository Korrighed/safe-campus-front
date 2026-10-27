// Le suffixe de requete est obligatoire (?component / ?url) : un import '*.svg'
// nu est ambigu avec la declaration native de vite/client (asset = string),
// qui l'emporte silencieusement sur toute declaration '*.svg' custom et
// typerait alors les composants d'icone comme des chaines.

declare module '*.svg?component' {
  import type { FunctionalComponent, SVGAttributes } from 'vue'

  const component: FunctionalComponent<SVGAttributes>
  export default component
}

declare module '*.svg?url' {
  const url: string
  export default url
}
