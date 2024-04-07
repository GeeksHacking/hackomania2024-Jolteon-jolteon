<template>
    <v-container
        fill-height
        fluid
        class="d-flex align-center bg-image"
    >
        <v-row>
            <v-col
                cols="12"
                md="8"
                class="mx-auto"
            >
                <v-card
                    height="850px"
                    class="rounded-xl"

                    style="position: relative;background-color: #F4F4F8;"

                >   
                    <div 
                        class="d-flex mb-3 align-center"
                        style="position: absolute; bottom: 0; width: 100%;z-index: 10000"
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
                            @keydown.enter="sendMessage"
                        ></v-text-field>
                        
                    </div>

                    <v-toolbar
                        color="#FFCE4F"
                    >
                        <v-avatar
                            size="50"
                            color="white"
                            class="mx-3"
                        >
                            <v-img
                                width="50px"
                                height="50px"
                                :src="avatar"
                                cover
                            ></v-img>
                        </v-avatar>
                        <v-toolbar-title class="text-subtitle-1 font-weight-medium">Welcome, {{ username }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn 
                            icon
                            @click="clearMessages"
                        >
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-card-text
                        class="d-flex flex-column"
                        style="height: 700px; overflow-y: scroll;"
                    >
                        <v-list-item
                            v-for="(message, index) in all_messages"
                            :key="index"
                            ref="listItem"
                            :class="message.user == 'bot' ? 'mr-auto' : 'ml-auto'"
                        >
                            <TextBubble 
                                v-if="message.type == 'TEXT'"
                                :data="message"
                            />

                            <ExpansionBubble
                                v-if="message.type == 'EXPANSION'"
                                :data="message"
                            ></ExpansionBubble>
                            <FormBubble
                                v-if="message.type == 'FORM'"
                                :data="message"
                            ></FormBubble>

                        </v-list-item>
                        <v-list-item></v-list-item>
                    </v-card-text>
                    
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>


<script>
import TextBubble from '@/components/chatComponents/TextBubble.vue'
import ExpansionBubble from '../components/chatComponents/ExpansionBubble.vue';
import FormBubble from '../components/chatComponents/FormBubble.vue';
import Avatar from "@/assets/splashArt.png"


import {
    getMyInfoUser,
    sendMessage
} from "@/apis/userApi"

export default {
    name: 'Chat',
    props: {
    },
    data() {
        return {
            dummy_messages: [
                {
                    user: "bot",
                    message: "Hello! I am Jamie 2.0, How may I help you today?",
                    type: "TEXT"
                },
                {
                    user: "bot",
                    message: "Recent Government Schemes & Grants",
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
                    message: "Energy Efficiency Grant Application",
                    type: "FORM",
                    data: [
                        {
                            field: "TEXT",
                            question: "Name",
                            choices: null
                        },
                        {
                            field: "SELECT",
                            question: "Nationality",
                            choices: [
                                "Singapore Citizen/PR",
                                "Non-Singapore Citizen"
                            ]
                        },
                    ]
                },

            ],
            starter_message: [
                {
                    user: "bot",
                    message: "Hello! I am Jamie 2.0, How may I help you today?",
                    type: "TEXT"
                },
                {
                    user: "bot",
                    message: "Recent Government Schemes & Grants",
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
              

            ],
            all_messages: [],
            curr_message: "",
            username: "",
            avatar: Avatar,
            botLoading: false

        }
    },
    watch: {
        boLoading(){
            if (this.botLoading){
                this.all_messages.push({
                    user: "bot",
                    message: "Please wait while I process your request...",
                    type: "TEXT",
                    data: null
                })
            }
            else{
                this.all_messages.pop()
            
            }
            
        }
    },
    components: {
        TextBubble,
        ExpansionBubble,
        FormBubble
    },
    methods: {

        async sendMessage() {
            const sessionId = localStorage.getItem("sessionId")

            if (this.curr_message.length > 0){
                this.all_messages.push({
                    user: "user",
                    message: this.curr_message,
                    type: "TEXT",
                    data: null
                })
                // this.botLoading = true
                // const response = await this.sendMessage(sessionId, this.curr_message)
                // this.botLoading = false
                // if (response.status == 200 && response.data){
                //     this.all_messages.push({
                //         user: "bot",
                //         message: response.data.message,
                //         type: "TEXT",
                //         data: null
                //     })
                // }
                // else{
                //     this.all_messages.push({
                //         user: "bot",
                //         message: "Sorry, I am unable to process your request at the moment. Please try again later.",
                //         type: "TEXT",
                //         data: null
                //     })
                
                // }

            }
            // check what's the keyword in the message
            if (this.curr_message.includes('form')){
                const message = this.dummy_messages.find(msg => msg.type === "FORM")
                this.all_messages.push(message)
            }
            if (this.curr_message.includes('menu') || this.curr_message.includes('list')){
                const message = this.dummy_messages.find(msg => msg.type === "EXPANSION")
            }

            this.curr_message = ""
            this.$nextTick(() => {
                const element = this.$refs.listItem[this.$refs.listItem.length - 1].$el;
                element.scrollIntoView({ behavior: 'smooth' });
            });
        },
        clearMessages(){
            this.curr_message = ''
            this.all_messages = []
            setTimeout(() => {
                this.all_messages = [...this.starter_message]
            }, 1200);
        },

        async fetchUser(){
            const sessionId = localStorage.getItem("sessionId")
            if (sessionId){
                const response = await getMyInfoUser(sessionId)

                if (response.status == 200 && response.data){
                    console.log(response.data)
                    this.username = response.data.payload.name
                }
            }
        }

    },

    async beforeMount() {
        this.all_messages = [...this.starter_message]
        await this.fetchUser()
    },
}
</script>