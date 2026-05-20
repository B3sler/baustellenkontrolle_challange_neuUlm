import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1565C0',
          'primary-darken-1': '#0D47A1',
          secondary: '#42A5F5',
          error: '#D32F2F',
          warning: '#F57F17',
          success: '#2E7D32',
          surface: '#FFFFFF',
          background: '#F5F5F5',
        },
      },
    },
  },
})
