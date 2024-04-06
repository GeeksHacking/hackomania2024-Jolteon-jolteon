const { v4  } = require('uuid')

const sql = require("../database/client")

const SessionApi = {


    createSession: async () => {

        const sessionId = v4();

        // 1. Insert into database
        let response = await sql`
            INSERT INTO SESSIONS 
            (
                session_id, 
                codeChallenge, 
                codeVerifier, 
                authorizationURL, 
                authorizationNonce,
                authorizationScope,
                accessToken,
                accessTokenSub
            ) VALUES (${sessionId}, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`
        console.log(response)

        // 2. Return sessionId

        return {
            statusCode: 200,
            body: {
                message: "Session created",
                sessionId: sessionId
            }
        }
    },

    getSession: async (sessionId) => {

        let response = await sql`SELECT * FROM SESSIONS WHERE session_id = ${sessionId}`
        console.log(response)

        if (response.length === 0) {
            return {
                statusCode: 404,
                body: {
                    message: "Session not found"
                }
            }
        }
        else {
            return {
                statusCode: 200,
                body: {
                    message: "Session found",
                    sessionId: response[0].session_id
                }
            }
        }
    },

    updateSession: async (sessionId, sessionDetails) => {
            
            let response = await sql`
                UPDATE SESSIONS 
                SET 
                    codeChallenge = ${sessionDetails.codeChallenge}, 
                    codeVerifier = ${sessionDetails.codeVerifier}, 
                    authorizationURL = ${sessionDetails.authorizationUrl}, 
                    authorizationNonce = ${sessionDetails.nonce}, 
                    authorizationScope = ${sessionDetails.scopes} 
                WHERE session_id = ${sessionId}`
            console.log(response)
    
            return {
                statusCode: 200,
                body: {
                    message: "Session updated"
                }
            }
    }
}