<template>
    <v-card
        :color="bubbleColor"
        width="fit-content"
        height="fit-content"
        class="pa-1 rounded-xl"
        flat

    >
        <v-card-text>
            <span
                class="font-weight-medium text-subtitle-1"
                :class="data.user === 'bot' ? 'text-grey-darken-2' : 'text-black'"
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