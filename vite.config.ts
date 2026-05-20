import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  base: '/baustellenkontrolle_challange_neuUlm/',
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
