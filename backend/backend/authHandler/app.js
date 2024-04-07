const LIBRARY_PATH = process.env.AWS ? "/opt/nodejs" : "../layers/nodejs"

const { generatePkcePair } = require("@opengovsg/sgid-client")
const {generateUUID} =  require(`${LIBRARY_PATH}/utils/generateUUID.js`)
const {triggerLambda} =  require(`${LIBRARY_PATH}/utils/triggerLambda.js`)
const { getParameterStoreValue } = require(`${LIBRARY_PATH}/aws-ssm.js`)

const { 
    addSession, 
    getSession,
    updateAccessToken,
    deleteSession
} = require(`${LIBRARY_PATH}/databaseFunctions.js`)
const {initClient} = require(`${LIBRARY_PATH}/SG_ID_client.js`)

const { AUTH_TABLENAME, REDIRECT_URI, ENV, APP_NAME, FRONTEND_URL } = process.env

const load_Values = async () => {
    const SGID_CLIENT_ID = await getParameterStoreValue(`${ENV}-${APP_NAME}-SGID_CLIENT_ID`)
    const SGID_CLIENT_SECRET = await getParameterStoreValue(`${ENV}-${APP_NAME}-SGID_CLIENT_SECRET`)
    const SGID_PRIVATE_KEY = await getParameterStoreValue(`${ENV}-${APP_NAME}-SGID_PRIVATE_KEY`)
    const SGID_SCOPES = ["openid", "myinfo.name", "myinfo.mobile_number"]

    return {
        SGID_CLIENT_ID,
        SGID_CLIENT_SECRET,
        SGID_PRIVATE_KEY,
        SGID_SCOPES
    }
}

function parseDate(val){
    // parse date into DD-MMM-YYYY format
    const date = new Date(val)
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()

    // if day is single digit, add a 0 in front

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = monthNames[month]
    const date_formatted = `${day < 10 ? '0' + day : day}-${monthName}-${year}`
    return date_formatted

}

module.exports = {

    getAuthURLEndpoint: async (event, context, callback) => {

        // Load constants
        const { SGID_CLIENT_ID, SGID_CLIENT_SECRET, SGID_PRIVATE_KEY, SGID_SCOPES } = await load_Values()
        
        // Initialize sg:ID client
        const client = await initClient(SGID_CLIENT_ID, SGID_CLIENT_SECRET, SGID_PRIVATE_KEY, REDIRECT_URI)

        // generate a session ID
        const sessionId = generateUUID()
        // create a PkcePair challenge
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
        const response = await addSession(AUTH_TABLENAME, session_details)

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Expose-Headers': 'Access-Control-Allow-Origin',
                'Access-Control-Allow-Credentials': true,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            body: JSON.stringify({
                url: url,
                sessionId: sessionId,
            })
        }
    },

    verifySessionId: async (event, context, callback) => {
        // get the sessionId from request query string
        const sessionId = event.queryStringParameters.sessionId

        // get session details from database
        const session_details = await getSession(AUTH_TABLENAME, sessionId)

        // check if session details is available
        if (session_details === undefined || session_details === null || session_details?.Item?.sessionId !== sessionId) {
            return {
                statusCode: 200,
                headers: {
                    Location: `${FRONTEND_URL}/error`,
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
                },
                body: JSON.stringify({
                    statusCode: 404,
                    sessionId: null,
                    message: "Session not found"
                })
            }
        }
        else{

            // check if access token works
            if (session_details.Item.accessToken !== "No value") {
                const { SGID_CLIENT_ID, SGID_CLIENT_SECRET, SGID_PRIVATE_KEY } = await load_Values()
                try {
                    const client = await initClient(SGID_CLIENT_ID, SGID_CLIENT_SECRET, SGID_PRIVATE_KEY, REDIRECT_URI)
                    let options = {
                        accessToken: session_details.Item.accessToken,
                        sub: session_details.Item.accessTokenSub
                    }
                    const userInfo = await client.userinfo(options)
                } catch (error) {
                    console.log(error)

                    // delete session from database
                    const response = await deleteSession(AUTH_TABLENAME, sessionId)


                    // remove access token from database
                    return {
                        statusCode: 200,
                        headers: {
                            Location: `${FRONTEND_URL}/error`,
                            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                            "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
                        },
                        body: JSON.stringify({
                            statusCode: 401,
                            sessionId: sessionId,
                            message: "Session expired",
                        })
                    }
                }
                
                
            }

            // return session details
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Expose-Headers': 'Access-Control-Allow-Origin',
                    'Access-Control-Allow-Credentials': true,
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    statusCode: 200,
                    sessionId: sessionId,
                    message: "Session found",
                })
            }
            
        
        }

        
    },

    redirectAuthURL: async (event, context, callback) => {
        // get the authorization code and session ID from request query string
        const authCode = event.queryStringParameters.code
        const sessionId = event.queryStringParameters.state

        // get session details from database
        const session_details = await getSession(AUTH_TABLENAME, sessionId)

        // validate the state match the session ID
        if (session_details?.Item?.sessionId !== sessionId || session_details === undefined) {
            return {
                statusCode: 404,
                headers: {
                    Location: `${FRONTEND_URL}/error`,
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
                },
                body: JSON.stringify({
                    statusCode: 404,
                    sessionId: null,
                    message: "Session not found"
                })
            }
        }
        const { SGID_CLIENT_ID, SGID_CLIENT_SECRET, SGID_PRIVATE_KEY } = await load_Values()

        // Exchange the authorization code and code verifier for the access token
        const client = await initClient(SGID_CLIENT_ID, SGID_CLIENT_SECRET, SGID_PRIVATE_KEY, REDIRECT_URI)
        const { accessToken, sub } = await client.callback({
            code: authCode,
            nonce: session_details.Item.authorizationNonce,
            codeVerifier: session_details.Item.codeVerifier
        })

        // update database with access token
        const payload = {
            sessionId: sessionId,
            accessToken: accessToken,
            accessTokenSub: sub
        }
        const response = await updateAccessToken(AUTH_TABLENAME, payload)

        // return redirect
        return {
            statusCode: 302,
            headers: {
                Location: `${FRONTEND_URL}/logged-in?sessionId=${sessionId}`,
                "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
            },
            body: JSON.stringify({
                statusCode: 302,
                sessionId: sessionId,
                message: "Session found",
            })
        }

    },

    getUserInfo: async (event, context, callback) => {
        // get the sessionId from request query string
        const sessionId = event.queryStringParameters.sessionId

        // get session details from database
        const session_details = await getSession(AUTH_TABLENAME, sessionId)


        // check if acccess token is available
        if (session_details?.Item?.accessToken === "No value") {
            return {
                statusCode: 404,
                headers: {
                    Location: `${FRONTEND_URL}/error`,
                    'Access-Control-Expose-Headers': 'Access-Control-Allow-Origin',
                    'Access-Control-Allow-Credentials': true,
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    statusCode: 404,
                    sessionId: null,
                    message: "Access token not found"
                })
            }
        }

        const { SGID_CLIENT_ID, SGID_CLIENT_SECRET, SGID_PRIVATE_KEY } = await load_Values()
        const client = await initClient(SGID_CLIENT_ID, SGID_CLIENT_SECRET, SGID_PRIVATE_KEY, REDIRECT_URI)

        let options = {
            accessToken: session_details.Item.accessToken,
            sub: session_details.Item.accessTokenSub
        }
        const userInfo = await client.userinfo(options)

        const user_name = userInfo.data['myinfo.name']
        const user_dob = userInfo.data['myinfo.date_of_birth']

        // trigger personnel registered lambda to check if user is registered
        const payload = {
            name: user_name,
            dob: parseDate(user_dob)
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Expose-Headers': 'Access-Control-Allow-Origin',
                'Access-Control-Allow-Credentials': true,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                statusCode: 200,
                sessionId: sessionId,
                message: "User registered",
                payload: payload
            })
        }
        

    }



}

