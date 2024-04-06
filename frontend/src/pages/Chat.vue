<template>
    <v-container
        fill-height
        fluid
        class="d-flex align-center"
        style="background-color: #F4F4F8;"
    >
        <v-row>
            <v-col
                cols="12"
                md="8"
                class="mx-auto"
            >
                <v-card
                    flat
                    style="position: relative;"
                    class="rounded-xl"
                >   
                    <div 
                        class="d-flex mb-3 align-center"
                        style="position: absolute; bottom: 0; width: 100%;"
                    >
                        <v-text-field
                            v-model="curr_message"
                            label="Ask a question!"
                            rounded
                            single-line
                            hide-details
                            variant="solo"
                            width="100%"
                            class="mx-2"
                            color="black"
                            append-inner-icon="mdi-send"
                        ></v-text-field>
                        
                    </div>

                    <v-toolbar
                        color="transparent"
                    >
                        <v-toolbar-title>Ask GovSchemes</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon>
                            <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-card-text
                        class="d-flex flex-column"
                        style="height: 750px;"
                    >
                        <v-list-item
                            v-for="(message, index) in all_messages"
                            :key="index"
                            class=""
                        >
                            <TextBubble 
                                v-if="message.type == 'TEXT'"
                                :data="message"
                            />

                            <ExpansionBubble
                                v-if="message.type == 'EXPANSION'"
                                :data="message"
                            ></ExpansionBubble>

                        </v-list-item>
                    </v-card-text>
                    
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>


<script>
import TextBubble from '@/components/chatComponents/TextBubble.vue'
import ExpansionBubble from '../components/chatComponents/ExpansionBubble.vue';
export default {
    name: 'Chat',
    props: {
    },
    data() {
        return {
            all_messages: [
                {
                    user: "bot",
                    message: "Hello! How can I help you today?",
                    type: "TEXT"
                },
                {
                    user: "bot",
                    message: "Hello! How can I help you today?",
                    type: "EXPANSION",
                    data: [
                        {
                            header: "Energy Efficiency Grant",
                            value: "The Energy Efficiency Grant (EEG) aims to support businesses in their sustainability journey by co-funding investment in energy-efficient (EE) equipment. The EEG will provide two tiers of support – a Base Tier to provide support for pre-approved EE equipment up to a $30,000 cap; and an Advanced Tier to support companies that wish to make larger investments for greater energy efficiency."
                        },
                        {
                            header: "The Enterprise Development Grant",
                            value: "The Enterprise Development Grant (EDG) supports projects that help you upgrade, innovate, grow and transform your business. Submit your individual project proposals with details on your business plans and project outcomes to take your business further. EDG funds qualifying project costs namely third-party consultancy fees, software and equipment, and internal manpower cost."
                        },
                        {
                            header: "Healthier Dining Grant",
                            value: "The HDG is a co-funding scheme offered by HPB to support our HDP Partners in the promotion and publicity of healthier menu items. HPB will reimburse up to 80% of the qualifying costs incurred for producing in-store marketing materials and website/app amendments, up to the approved grant amount, subject to applicable terms and conditions. Visit the Home page for more information about the HDP."
                        },
                    ]
                },
                {
                    user: "bot",
                    message: "Hello! How can I help you today?",
                    type: "TEXT"
                },
            ],
            curr_message: ""

        }
    },
    components: {
        TextBubble,
        ExpansionBubble
    },
    methods: {


    },
}
</script>