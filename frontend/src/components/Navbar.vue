<template>
    <v-toolbar
        color="#FFCE4F"
    >
        <v-avatar
            size="40"
            color="white"
            class="mx-2"
        >
            <v-img
                width="40px"
                height="40px"
                :src="avatar"
            ></v-img>
        </v-avatar>
        <v-toolbar-title>Jolteon</v-toolbar-title>
        <v-spacer></v-spacer>
        
    </v-toolbar>
</template>


<script>
import Avatar from "@/assets/splashArt.png"
export default {
    name: 'Navbar',
    props: {
    },
    data() {
        return {
            avatar: Avatar

        }
    },
    methods: {


    },
}
</script>