
const { SgidClient } = require('@opengovsg/sgid-client')
const { generatePkcePair } = require("@opengovsg/sgid-client")

const {
    getSession,
    createSession
} = require("./Session");

const AuthApis = {


    getAuthURL: async () => {

        const sgidClient = new SgidClient({
            clientId: process.env.SGID_CLIENT_ID,
            clientSecret: process.env.SGID_CLIENT_SECRET,
            redirectUri: process.env.SGID_REDIRECT_URI,
            scopes: ['openid', 'myinfo.name', 'myinfo.mobile_number'],
        })

        // Create a session
        const session = await createSession()

        if (session.statusCode !== 200) {
            return session
        }
        const sessionId = session.body.sessionId

        // create PkcePair
        const { codeChallenge, codeVerifier } = generatePkcePair()
        // generate authorization URL
        const { url, nonce } = client.authorizationUrl({
            state: sessionId,
            codeChallenge,
            scope: SGID_SCOPES
        })
        // store session details in database
        const session_details = {
            sessionId: sessionId,
            codeChallenge: codeChallenge,
            codeVerifier: codeVerifier,
            authorizationUrl: url,
            scopes: SGID_SCOPES.toString(),
            nonce: nonce
        }

        // update session with the details
        const updateSession = await updateSession(sessionId, session_details)
        if (updateSession.statusCode !== 200) {
            return updateSession
        }


        return {
            statusCode: 200,
            body: {
                message: "Authorization URL generated",
                authorizationURL: url
            }
        }
    },

    authRedirect: (request) => {

        // 1. Figure out if session exists

        // 2. If session exists, redirect to /logged-in




        


    }
}