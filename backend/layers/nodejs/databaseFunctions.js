const AWS = require('aws-sdk')
const bcrypt = require('bcryptjs')
const saltRounds = 10

const {
    ENV,
    APP_NAME,
} = process.env

module.exports = {

    addSession: async (tablename, session_details) => {
        console.log("====>DB:", tablename, session_details)
        const db = new AWS.DynamoDB.DocumentClient()

        const Items = {
            sessionId: session_details.sessionId,
            codeChallenge: session_details.codeChallenge,
            codeVerifier: session_details.codeVerifier,
            authorizationUrl: session_details.authorizationUrl,
            authorizationNonce: session_details.nonce,
            authorizationScopes: session_details.scopes,
            accessToken: "No value",
            accessTokenSub: "No value"
        }

        let response = await db.put({
            TableName: tablename,
            Item: Items
        }).promise()

        console.log("====>DB:", response)
        return response



    },

    getSession: async (tablename, sessionId) => {
        const db = new AWS.DynamoDB.DocumentClient()

        const params = {
            TableName: tablename,
            Key: {
                sessionId: sessionId
            }
        }
        const response = await db.get(params).promise()
        console.log("====>DB:", response)
        return response
    },

    updateAccessToken: async (tableName, payload) => {
        const db = new AWS.DynamoDB.DocumentClient()
        console.log(tableName, payload)
        const response = await db.update({
            TableName: tableName,
            Key: {
                sessionId: payload.sessionId
            },
            UpdateExpression: "set accessToken = :accessToken, accessTokenSub = :accessTokenSub",
            ExpressionAttributeValues: {
                ":accessToken": payload.accessToken,
                ":accessTokenSub": payload.accessTokenSub
            }
        }).promise()
        console.log("====>DB:", response)
        return response
    },

    deleteSession: async (tableName, sessionId) => {
        const db = new AWS.DynamoDB.DocumentClient()
        const response = await db.delete({
            TableName: tableName,
            Key: {
                sessionId: sessionId
            }
        }).promise()
        console.log("====>DB:", response)
        return response
    },

    getUser: async (tableName, user_details) => {
        const db = new AWS.DynamoDB.DocumentClient()

        const {name, dob} = user_details
        
        // get all user from db without filter
        const params = {
            TableName: tableName,
        }
        const response = await db.scan(params).promise()
        if (response.Items.length === 0){
            return response
        }
        else{
            // for each user, compare name and dob
            console.log("====>DB Items:", response.Items)
            
            const comparisons = response.Items.map((user) => {
                return bcrypt.compare(name + dob, user.userUUID)
            })

            const results = await Promise.all(comparisons)
            const user = response.Items[results.indexOf(true)]

            console.log("====>DB User Selected:", user)
            // return user if found
            if (user){
                return {
                    Item: user
                }
            }
            else{
                return {}
            }
        }
        


        
    },

    addUser: async(tableName, user_details) => {

        const {name, DOB, ORD, s3_uri} = user_details
        // hash name + DOB
        const salt = await bcrypt.genSalt(saltRounds)
        const hashedNameDOB = await bcrypt.hash(name + DOB, salt)

        // check if user already exists
        const db = new AWS.DynamoDB.DocumentClient()

        // add user
        const Items = {
            userUUID: hashedNameDOB,
            name: name,
            DOB: DOB,
            ORD: ORD,
            unit: "No value",
            photo_uri: s3_uri,
            card_created: `https://dev-infocard-output-images.s3.amazonaws.com/processed${DOB}-${name}.jpg`,
            created_at: Date.now(),
            updated_at: Date.now()
        }
        const response = await db.put({
            TableName: tableName,
            Item: Items
        }).promise()
        console.log("====>DB:", response)
        return response
        
        

    }


}