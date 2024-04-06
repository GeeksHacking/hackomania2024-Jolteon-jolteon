import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import {createRouter, createWebHistory} from 'vue-router'

import Home from "@/pages/Home.vue"
import Chat from '@/pages/Chat.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/chat', component: Chat}
  ],
})



loadFonts()

createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app')
