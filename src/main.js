import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import '@pnotify/core/dist/PNotify.css'
import '@pnotify/core/dist/BrightTheme.css'
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
