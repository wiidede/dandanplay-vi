import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'

import '@unocss/reset/tailwind-compat.css'
import './styles/main.scss'
import 'uno.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)

// router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})
router.afterEach(() => {
  NProgress.done()
})
app.use(router)

// pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

app.mount('#app')
