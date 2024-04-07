
const LIBRARY_PATH = process.env.AWS ? "/opt/nodejs" : "../layers/nodejs"


const {
    addSession,
    getSession,
    getUser,
    addUser
} = require(`${LIBRARY_PATH}/databaseFunctions.js`)

const {
    parseFormData
} = require(`${LIBRARY_PATH}/utils/parseFormData.js`)
 


const { 
    USER_TABLENAME, 
    ApplicationPersonnelImageBucket 
} = process.env




module.exports = {
    mainHandler: (event, context) => {
        // console log event details
        console.log(JSON.stringify(event))


        return {
            statusCode: 200,

            body: JSON.stringify({
                message: 'Hello World!',
                input: event,
            }),
        }
    },

    getUserRegistered: async (event, callback) => {
        console.log(event)
        const body = JSON.parse(event.body)

        console.log(body)

        const get_user = await getUser(USER_TABLENAME, {name: body.name, dob: body.dob})

        if (get_user.Item) {
            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
                },
                body: JSON.stringify({
                    statusCode: 200,
                    message: "User already registered",
                }),
            }
        }
        else{
            return {
                statusCode: 404,
                headers: {
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
                },
                body: JSON.stringify({
                    statusCode: 404,
                    message: "User not registered",
                }), 
            }
        }

    },


}