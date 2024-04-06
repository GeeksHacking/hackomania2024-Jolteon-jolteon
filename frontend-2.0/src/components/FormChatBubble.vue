<template>
    <v-card
        flat
        width="100%"
        height="100%"
        color="transparent"
    >
        <v-toolbar
            color="transparent"
        >
            <v-card-title>{{ formData.title }}</v-card-title>
        </v-toolbar>
        <v-card-text>
            <v-form>
                <v-row>
                    <v-col
                        class="px-0"
                    >
                        <v-text-field
                            v-for="(field, index) in formData.fields"
                            :key="index"
                            :label="field.label"
                            :hint="field.hint"
                            :rules="field.rules"
                            :type="field.type"
                            :v-model="field.value"
                            variant="outlined"
                            width="100%"
                        >
                        </v-text-field>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
    </v-card>
</template>


<script>
export default {
    name: 'FormChatBubble',
    props: {
        formType: String,
        formData: Object

    },
    data() {
        return {


        }
    },
    methods: {


    },
}
</script>