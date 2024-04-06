<template>
    <v-card
        :color="bubbleColor"
        width="fit-content"
        min-width="350px"
        height="fit-content"
        class="pa-1 rounded-xl"
        flat

    >
        <v-card-title class="text-subtitle-1">{{ data.message }}</v-card-title>
        <v-card-text >
            <v-list-item
                v-for="(field, index) in data.data"
                :key="index"
                class="px-0"
            >
                <v-text-field
                    v-if="field.field == 'TEXT'"
                    :placeholder="field.question"
                    variant="outlined"
                ></v-text-field>
                <v-select
                    v-if="field.field == 'SELECT'"
                    :placeholder="field.question"
                    :items="field.choices"
                    variant="outlined"
                ></v-select>
            </v-list-item>
        </v-card-text>

    </v-card>
</template>


<script>
export default {
    name: 'FormBubble',
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