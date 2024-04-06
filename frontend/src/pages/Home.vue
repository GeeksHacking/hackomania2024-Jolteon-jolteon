<template>
    <v-container
        fill-height
        fluid
        class="d-flex align-center justify-center"
        style="background-color: #F4F4F8;"

    >
        <v-row>
            <v-col
                cols="12"
                md="3"
                class="mx-auto d-flex flex-column"
            >
                <v-img
                    :src="avatar"
                    min-width="212px"
                    min-height="212px"
                    contained
                ></v-img>
                <span 
                    class="text-center font-weight-bold"
                    :class="mobile ? 'text-h2' : 'text-h1'"
                >Jamie 2.0</span>
            </v-col>
            <v-col
                cols="12"
                md="3"
                class="mx-auto"
            >
                <v-btn
                    width=""
                ></v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>


<script>
import HeroSection from '@/components/heroSection/HeroSection.vue'
import Avatar from "@/assets/splashArt.png"

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
            avatar: Avatar


        }
    },
    methods: {


    },
}
</script>