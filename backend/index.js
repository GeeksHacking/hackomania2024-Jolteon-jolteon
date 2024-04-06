const express = require("express");

const {
    createUser
} = require("./databaseFunctions/User");

const {
    createSession
} = require("./databaseFunctions/Session");

const {
    getAuthURL
} = require("./databaseFunctions/Auth");


const app = express();

app.use(express.json());
app.use(express.urlencoded())


app.get("/", () => {
    return {
        statusCode: 200,
        body: {
            message: "Hello World"
        }
    }
})

app.get("/api/auth-url", async(req, res) => {

    const response = await getAuthURL();

    return res.status(response.statusCode).json(response.body);
})

app.get("/api/redirect", async(req, res) => {
    return res.status(200).json({
        message: "Redirected"
    })
})

app.post("/api/message", async (req, res) => {
    return res.status(200).json({
        message: "Message received"
    })


})


app.listen(8081, () => {
    console.log("Server running on port 8081")
})