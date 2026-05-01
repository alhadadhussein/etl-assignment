import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { msalInstance } from './auth/msalInstance'
import { useAuth } from './auth/useAuth'

msalInstance.initialize().then(async () => {
  await msalInstance.handleRedirectPromise()

  const { setActiveAccount } = useAuth()
  setActiveAccount()

  const app = createApp(App)
  app.use(router)
  app.mount('#app')
})
