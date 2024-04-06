<template>
    <v-card
        :color="bubbleColor"
        width="fit-content"
        height="fit-content"
        class="pa-1 rounded-xl"
        flat

    >
        <v-card-title class="text-subtitle-1">{{ data.message }}</v-card-title>
        <v-card-text>
            <v-expansion-panels
                variant="accordion"
                class="elevation-0"
            >
                <v-expansion-panel
                    v-for="panel in data.data"
                    :key="panel"
                >
                    <v-expansion-panel-title>{{ panel.header }}</v-expansion-panel-title>
                    <v-expansion-panel-text>{{ panel.value }}</v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-card-text>
    </v-card>
</template>


<script>
export default {
    name: 'ExpansionBubble',
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