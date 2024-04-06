from flask import (
    Flask,
    request,
    redirect,
)
from flask_cors import CORS, cross_origin
from flask_talisman import Talisman
import os
from sgid_client import SgidClient, generate_pkce_pair
from dotenv import load_dotenv
from uuid import uuid4
from urllib.parse import urlencode, parse_qs
import random
import json


from handlers.langchainHandler import tavilySearchAgent

load_dotenv()

# In-memory store for user session data
session_data = {}
PORT = os.getenv("PORT")

app = Flask(__name__)

# Enable CORS
CORS(app)

# create sgID client
def createClient():
    print(os.getenv("SGID_CLIENT_ID"))
    print(os.getenv("SGID_CLIENT_SECRET"))
    print(os.getenv("SGID_PRIVATE_KEY"))
    return SgidClient(
        client_id=os.getenv("SGID_CLIENT_ID"),
        client_secret=os.getenv("SGID_CLIENT_SECRET"),
        private_key=os.getenv("SGID_PRIVATE_KEY"),
        redirect_uri=f"http://localhost:{PORT}/api/redirect",
    )

# SGID_client = createClient()


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


# create routes
@app.route('/api/auth-url', methods=['GET'])
def generateAuthUrl():
    state = str(uuid4())

    code_verifier, code_challenge = generate_pkce_pair()
    url, nonce = SGID_client.authorization_url(
        state=state, code_challenge=code_challenge
    )

    session_data[state] = {
        'url': url,
        'nonce': nonce,
        'state': state,
        'code_verifier': code_verifier
    }

    return {
        'url': url,
        'nonce': nonce,
        'state': state,
        'code_verifier': code_verifier
    }

@app.route('/api/redirect', methods=['GET'])
def redirectCallback():
    auth_code = request.args.get('code')
    sessionId = request.args.get('state')


    session = session_data.get(sessionId)

    if not session:
        return
        # return redirect(f"{os.g}etenv("FRONTEND_URI")/error")
    
    sub, access_token = SGID_client.callback(
        code=auth_code, 
        code_verifier=session["code_verifier"], 
        nonce=session["nonce"]
    )
    session["access_token"] = access_token
    session["sub"] = sub
    session_data[sessionId] = session


    return redirect(f"{os.getenv('FRONTEND_URI')}/")


@app.route('/api/userinfo', methods=['GET'])
def getUser():
    sessionId = request.args.get('sessionId')
    session = session_data.get(sessionId)

    if not session:
        return redirect(f"{os.getenv('FRONTEND_URI')}/error")
    
    sub, data = SGID_client.userinfo(
        sub=session["sub"],
         access_token=session['access_token']
    )


    return {
        'statusCode': 200,
        'sessionId': sessionId,
        'data': data
    }

@app.route('/api/logout', methods=['GET'])
def logout():
    sessionId = request.args.get('sessionId')
    session = session_data.get(sessionId)

    if not session:
        return redirect(f"{os.getenv('FRONTEND_URI')}/error")
    
    SGID_client.logout(
        sub=session["sub"],
        access_token=session['access_token']
    )

    del session_data[sessionId]

    return redirect(f"{os.getenv('FRONTEND_URI')}/")


@app.route("/message", methods=["POST", "OPTIONS"])
@cross_origin()
def messageHandler():
    data = request.json()

    response = tavilySearchAgent(data["message"])

    return {
        "statusCode": 200,
        "data": response
    }




