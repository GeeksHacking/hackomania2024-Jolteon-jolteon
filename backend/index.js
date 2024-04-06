const express = require('express');
const app = express();
const {getAllUsers} = require('./models/User');



// ========== ROUTES =========

app.get("/", (req, res) => {

    return res.status(200).json({
        message: 'Welcome to the API'
    })

})


app.get("/get-all-users", async (req, res) => {
    
        const response = await getAllUsers(req, res)
    
        return res.status(response.statusCode).json(response.body)
})




app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')

})
