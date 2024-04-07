<template>
    <v-card
        :color="bubbleColor"
        width="fit-content"
        height="fit-content"
        class="pa-1 rounded-xl"
        flat

    >
        <v-card-text class="pa-0">
            <span   
                class="font-weight-medium text-subtitle-1 px-4 py-2"
                :class="data.user === 'bot' ? 'text-black' : 'text-black'"
            >{{ data.message }}</span>
        </v-card-text>
    </v-card>
</template>


<script>
export default {
    name: 'TextBubble',
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {


        }
    },
    computed: {
        bubbleColor() {
            if (this.data.user === 'bot'){
                return 'amber-lighten-2'
            }
            return 'grey-lighten-2'
        },
    },
    methods: {


    },
}
</script>