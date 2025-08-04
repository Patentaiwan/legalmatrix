// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/tailwind.css'],
  colorMode: {
    preference: 'light',
    fallback: 'light',
    storageKey: 'color-mode',
    classSuffix: ''
  },
  ui: {
    theme: {
      colors: [
        'primary',
        'secondary',
        'tertiary',
        'info',
        'success',
        'warning',
        'error',
        'gray',
        'cyan',
        'emerald',
        'rose',
        'fuchsia',
        'lime',
        'orange',
        'teal',
        'violet',
        'green',
        'blue',
        'red',
      ]
    }
  }
})