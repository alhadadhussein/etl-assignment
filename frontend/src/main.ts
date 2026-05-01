import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { msalInstance } from './auth/msalInstance'
import { useAuth } from './auth/useAuth'

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { VFileUpload } from 'vuetify/labs/VFileUpload'

const vuetify = createVuetify({
  components: {
    VFileUpload,
  },
})

msalInstance.initialize().then(async () => {
  await msalInstance.handleRedirectPromise()

  const { setActiveAccount } = useAuth()
  setActiveAccount()

  const app = createApp(App)
  app.use(router)
  app.use(vuetify)
  app.mount('#app')
})
