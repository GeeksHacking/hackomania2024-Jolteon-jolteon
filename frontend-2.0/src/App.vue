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
      <ChatWindow />
    </v-main>
  </v-app>
</template>

<script>
import Navbar from './components/Navbar.vue';
import ChatWindow from './components/ChatWindow.vue';

export default {
  name: 'App',

  components: {
    Navbar,
    ChatWindow,
  },

  data: () => ({
    //
  }),
}
</script>
