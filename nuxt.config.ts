// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['nuxt-vuefire', '@vueuse/nuxt', '@nuxt/ui'],
  vuefire: {
    auth: true, // (opcjonalnie) włącz zarządzanie uwierzytelnianiem Firebase
    config: {
      apiKey: 'AIzaSyDbJnVqFjYgzJ1VM-HOYNSfh83Ar9WA868',
      authDomain: 'asg-radar-v1.firebaseapp.com',
      projectId: 'asg-radar-v1',
      storageBucket: 'asg-radar-v1.firebasestorage.app',
      messagingSenderId: '497911779357',
      appId: '1:497911779357:web:78d0886f387e5bc16636f4',
      measurementId: 'G-XSQG58KZ14'
    }
  },
  ui: {
    primary: 'green',
    gray: 'zinc'
  }
})
