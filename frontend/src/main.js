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
    { path: '/chat', component: Chat},
    { path: "/:pathMatch(.*)*", component: Error, },
  ],
})


router.beforeEach((to, from, next) => {

  if (to.path === "/logged-in" && to.query.sessionId){
    const sessionId = to.query.sessionId
    // add sessionId to local storage
    localStorage.setItem("sessionId", sessionId)

    if (localStorage.getItem("sessionId")){
      return next({path: "/chat", query: { sessionId: sessionId } })

    }

    return next("/error")



  }
  next()

})


loadFonts()

createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app')
