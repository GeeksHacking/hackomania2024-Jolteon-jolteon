<template>
  <v-app>

    <v-app-bar
      flat
    >
      <Navbar />
    </v-app-bar>
    <v-main
      class="d-flex"
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
