from gemini import generate
from flask import Flask, render_template, request
from vertexai.preview.generative_models import GenerativeModel

import os
import vertexai

# pylint: disable=C0103
app = Flask(__name__)
vertexai.init(project="rising-precinct-303719", location="us-central1")
model = GenerativeModel("gemini-1.0-pro-vision-001")
chat_session = model.start_chat(history=[])

@app.route('/message', methods=['GET', 'POST'])
def index():
    """Return a friendly HTTP greeting."""
    message = "It's running!"
    if request.method == 'POST':
        # user_input_image = request.files.get('prompt_image')
        # print(user_input_image)
        if request.form.get('prompt_text'):
            user_input_text = request.form.get('prompt_text')
        else:
            user_input_text = request.get_json()['message']
        print(user_input_text)

        # Parse image into bytecode haiyaa
        # mime_type = user_input_image.content_type
        # print(mime_type)
        # user_input_image = user_input_image.read()
        # print(user_input_image)
        # user_input_image = Part.from_data(data=user_input_image, mime_type=mime_type)

        if request.form.get('prompt_text'):
            return render_template('text.html', response=generate(user_input_text, chat_session=chat_session))
        else:
            return generate(user_input_text, chat_session=chat_session) # render_template('text.html', response=generate(user_input_text))

    else:
        return render_template('text.html')

if __name__ == '__main__':
    server_port = os.environ.get('PORT', '8081')
    app.run(debug=False, port=server_port, host='0.0.0.0')