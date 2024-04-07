<template>
    <v-container
        fill-height
        fluid
        class="d-flex align-center justify-center"
        

    >
        <v-row>
            <v-col
                cols="12"
                md="12"
                class="mx-auto d-flex"
            >
                <v-img
                    :src="avatar"
                    max-width="264px"
                    max-height="304px"
                    contained
                    class="mx-auto"
                ></v-img>
                
            </v-col>
            <v-col
                cols="12"
                class="mx-auto text-center"
            >
                <span 
                    class="text-center font-weight-bold"
                    :class="mobile ? 'text-h2' : 'text-h1'"
                >Jamie 2.0</span>
            </v-col>
            <v-col
                cols="8"
                md="2"
                class="mx-auto"
            >
                <v-btn
                    width="100%"
                    color="red-darken-2"
                    size="large"
                    class="px-2 font-weight-medium"
                    @click="loginButtonHandler"
                >Login with Singpass</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<style>

.bg-image{
    background-image: url("@/assets/background.jpg");
    background-size: cover;
}

</style>

<script>
import HeroSection from '@/components/heroSection/HeroSection.vue'
import Avatar from "@/assets/splashArt.png"
import background from "@/assets/backgroun.jpg"

import {
    retrieveSingpassAuthUrl
} from "@/apis/authApi"

export default {
    name: 'Home',
    props: {
        mobile: Boolean
    },
    components: {
        HeroSection,
    },
    data() {
        return {
            avatar: Avatar,
            background: background


        }
    },
    methods: {

        async loginButtonHandler(){
            const response = await retrieveSingpassAuthUrl()
            if (response.status == 200 && response.data){
                window.location.href = response.data.url
            }
        }
    },
}
</script>