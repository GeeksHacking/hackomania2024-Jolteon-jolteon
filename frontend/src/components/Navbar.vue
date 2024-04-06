<template>
    <v-toolbar
        color="#FFCE4F"
    >
        <v-btn
            size="large"
            variant="text"
            :ripple="false"
            @click="$router.push('/')"
        >
            <v-avatar
            size="40"
            color="white"
            class="mr-2"
        >
            <v-img
                width="40px"
                height="40px"
                :src="avatar"
            ></v-img>
        </v-avatar>
            <span class="text-h6">Jolteon</span>
        </v-btn>

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