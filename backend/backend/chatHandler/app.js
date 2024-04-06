
const LIBRARY_PATH = process.env.AWS ? "/opt/nodejs" : "../layers/nodejs"


const {
    addSession,
    getSession,
    updateAccessToken,
    getUser,
    addUser
} = require(`${LIBRARY_PATH}/databaseFunctions.js`)

const {
    parseFormData
} = require(`${LIBRARY_PATH}/utils/parseFormData.js`)
 
const {
    uploadImage
} = require(`${LIBRARY_PATH}/imageBucketFunctions.js`)

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

    formSubmitHandler: async (event, context) => {
        // get formData from multipart/form-data
        const parsed_data = await parseFormData(event)
        // get sessionId from query string
        const sessionId = event.queryStringParameters.sessionId

        const formData = {
            name: parsed_data.name,
            dob: parsed_data.dob,
            ord: parsed_data.ord,
        }

        console.log("formData", formData)

        // check if user has submitted form before
        const get_user = await getUser(USER_TABLENAME, {name: formData.name, DOB: formData.dob})
        console.log("get_user", get_user)
        if (get_user.Item) {
            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
                },
                body: JSON.stringify({
                    sessionId: sessionId,
                    message: "User already exists",
                }),
            }
        }
        else{
            // decode image from base64 to buffer
            const imageBuffer = parsed_data.files[0].content
            const imageFileType = parsed_data.fileType

            // upload to s3
            const upload_image = await uploadImage(
                ApplicationPersonnelImageBucket, 
                `${sessionId}_${formData.name}`, 
                imageFileType,
                imageBuffer
            )
          

            // add user to database
            const add_user = await addUser(USER_TABLENAME, {name: formData.name, DOB: formData.dob, ORD: formData.ord, s3_uri: upload_image})
            console.log("add_user", add_user)

            if (add_user) {
                return {
                    statusCode: 200,
                    headers: {
                        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                        "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
                    },
                    body: JSON.stringify({
                        sessionId: sessionId,
                        message: "User added successfully",
                    }),
                }
            }
        }

    },


}