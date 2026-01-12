import 'bootstrap/dist/css/bootstrap.css'
import 'vue-toastification/dist/index.css'
import { vMaska } from "maska/vue"
import { createApp } from 'vue'
import Toast, { POSITION } from 'vue-toastification'
import App from '@/App.vue'
import router from '@/routers/router'

const app = createApp(App)

app.directive("maska", vMaska)
app.provide('router', router)
app.use(router)
app.use(Toast, {
  position: POSITION.TOP_CENTER,
  timeout: 2000,
  closeOnClick: true,
  pauseOnHover: false  
})
app.mount('#app')