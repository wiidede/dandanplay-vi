import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import './styles/main.scss'
import 'uno.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/es/components/notification/style/css'

import './utils/global'

const app = createApp(App)

// router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
app.use(router)

// pinia
const pinia = createPinia()
app.use(pinia)

app.mount('#app')
