<template>
    <v-container
        fill-height
        fluid
        class="d-flex"
        style="background-color: #F4F4F8;"

    >
        <v-row>
            <v-col
                cols="12"
                md="6"
                class="mx-auto"
            >
                <HeroSection />
            </v-col>
        </v-row>
    </v-container>
</template>


<script>
import HeroSection from '@/components/heroSection/HeroSection.vue'
export default {
    name: 'Home',
    props: {
    },
    components: {
        HeroSection,
    },
    data() {
        return {


        }
    },
    methods: {


    },
}
</script>