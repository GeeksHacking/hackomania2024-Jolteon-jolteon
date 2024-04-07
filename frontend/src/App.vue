<template>
  <v-app>

    
    <v-main
      class="d-flex bg-image"
    >
      
      <router-view

      ></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'App',

  components: {
    Navbar,
  },

  data: () => ({
    //
  }),
}
</script>
