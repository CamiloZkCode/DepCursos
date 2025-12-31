import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './routes'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'  // ← Nueva importación

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate) 

app.use(pinia)
app.use(router)
app.mount('#app')