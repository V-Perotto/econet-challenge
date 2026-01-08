import { createApp } from 'vue'
import Toast, { POSITION } from 'vue-toastification'
import App from '@/App.vue'

import router from '@/routers/router'

import 'bootstrap/dist/css/bootstrap.css'
import 'vue-toastification/dist/index.css'

const app = createApp(App)

app.provide('router', router)
app.use(router)
app.use(Toast, {
  position: POSITION.TOP_CENTER,
  timeout: 5000,
})
app.mount('#app')