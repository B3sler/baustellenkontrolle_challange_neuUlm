import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'blueprint',
    themes: {
      blueprint: {
        dark: false,
        colors: {
          background: '#F8FAFC',
          surface: '#FFFFFF',
          primary: '#2563EB',
          secondary: '#63B3ED',
          error: '#EF4444',
          warning: '#F59E0B',
          success: '#22C55E',
          info: '#0EA5E9',
          'on-background': '#0F172A',
          'on-surface': '#0F172A',
          'on-primary': '#FFFFFF',
          'surface-variant': '#F1F5F9',
          'on-surface-variant': '#64748B',
        },
      },
    },
  },
})
