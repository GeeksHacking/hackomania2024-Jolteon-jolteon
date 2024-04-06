import base64
import os
import vertexai
from vertexai.preview.generative_models import GenerativeModel, Part
import vertexai.preview.generative_models as generative_models


vertexai.init(project="rising-precinct-303719", location="us-central1")
model = GenerativeModel("gemini-1.0-pro-vision-001")
chat = model.start_chat(history=[])


# TODO: Adjust the inputs to integrate and allow JS front-end to pass inputs
def generate(user_input):
    '''
    '''
    responses = chat.send_message(
    content=user_input,
    generation_config={
        "max_output_tokens": 2048,
        "temperature": 0.9,
        "top_p": 1
    },
    safety_settings={
            generative_models.HarmCategory.HARM_CATEGORY_HATE_SPEECH: generative_models.HarmBlockThreshold.BLOCK_ONLY_HIGH,
            generative_models.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: generative_models.HarmBlockThreshold.BLOCK_ONLY_HIGH,
            generative_models.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            generative_models.HarmCategory.HARM_CATEGORY_HARASSMENT: generative_models.HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    stream=False,
    )

    return responses.text

# Save chat history to db, read user chat history to get context

if __name__ == '__main__':
    print('Sample chat session')
    print(generate('Who is Lee Hsien Loong\'s father?'))
    print(generate('Follow-up from previous response: What is said father\'s achievements?'))