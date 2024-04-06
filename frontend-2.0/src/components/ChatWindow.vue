<template>
    <v-container
        fluid
        fill-height
        class="d-flex bg-grey-lighten-3"
    >
        <v-row>
            <v-col
                cols="12"
                md="8"
                class="d-flex mx-auto"
            >
                <v-card
                    width="100%"
                    flat
                    class="rounded-xl"
                    style="position: relative;"
                >
                    <div 
                        class="d-flex align-center mb-3"
                        style="position: absolute; bottom: 0; width: 100%;"
                    >
                        <v-text-field
                            v-model="curr_message"
                            placeholder="Type a message..."
                            variant="solo"
                            class="mx-4"
                            hide-details
                            rounded
                            style="width: 100%;"
                            
                            @keydown.enter="send_message"
                        ></v-text-field>
                        <v-btn
                            icon
                            class="mr-4"
                        >
                            <v-icon>mdi-send</v-icon>
                        </v-btn>
                    </div>
                    <v-toolbar
                        color="white"
                    >
                        <v-avatar
                            size="40"
                            color="white"
                            class="ml-4"
                        >
                            <v-icon>mdi-robot</v-icon>
                        </v-avatar>
                        <v-card-title class="mx-auto">GovSchemes Bot</v-card-title>
                        <v-toolbar-items>
                            <v-btn
                                icon="mdi-menu"
                            ></v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                    <v-card-text>
                        <!-- auto populate from all_messages; bot messages justify-left, user message justify-right -->
                        <v-row>
                            <v-col
                                v-for="message in all_messages"
                                :key="message"
                                cols="12"
                                class="d-flex"
                            >
                                <v-card
                                    class="rounded-xl"
                                    width="fit-content"
                                    style="max-width: 70%;"
                                    :class="message.sender == 'bot' ? 'mr-auto bg-grey-lighten-2' : 'ml-auto bg-blue-darken-1'"
                                >
                                    <v-card-text
                                        v-if="message.type == 'text'"
                                        class="px-4 py-2"
                                    >
                                        {{ message.message }}
                                    </v-card-text>

                                    <v-card-text
                                        v-if="message.type == 'form'"
                                        class="px-4 py-2"
                                    >
                                        <FormChatBubble
                                            :formData="message.formData"
                                        />
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>

                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

    </v-container>
</template>


<script>
import FormChatBubble from './FormChatBubble.vue';
export default {
    name: 'ChatWindow',
    props: {
    },
    data() {
        return {
            all_messages: [
                {
                    message: "Hello! I am GovSchemes Bot. How can I help you today?",
                    type: "text",
                    sender: "bot"
                },
                
            ],
            curr_message: ""

        }
    },
    components: {
        FormChatBubble
    },
    methods: {

        send_message() {
            
            this.all_messages.push({
                message: this.curr_message,
                sender: "user",
                type: "text"
            })

            if (this.curr_message == "iras"){
                this.all_messages.push({
                    message: "IRAS Form",
                    type: "form",
                    formData: {
                        title: "IRAS Form",
                        fields: [
                            {
                                label: "Name",
                                hint: "Enter your name",
                                rules: [
                                    v => !!v || "Name is required"
                                ],
                                type: "text",
                                value: ""
                            },
                            {
                                label: "Email",
                                hint: "Enter your email",
                                rules: [
                                    v => !!v || "Email is required",
                                    v => /.+@.+\..+/.test(v) || "E-mail must be valid"
                                ],
                                type: "email",
                                value: ""
                            },
                            {
                                label: "Phone",
                                hint: "Enter your phone number",
                                rules: [
                                    v => !!v || "Phone is required",
                                    v => (v && v.length == 8) || "Phone number must be 8 digits"
                                ],
                                type: "number",
                                value: ""
                            }
                        ]
                    },
                    sender: "bot"
                })
                
            }

            this.curr_message = ""
        }

    },
}
</script>