const httpServer = require("http").createServer();

const {
    createUser
} = require("./databaseFunctions/User");



const io = require("socket.io")(httpServer, {
  // initial configuration
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
    },


});

io.on("connection", (socket) => {
  
    console.log("New client connected");
    socket.on("createUser", async (data) => {
        console.log("createUser event received with data: ", data);
        try {
            const user = await createUser(data);
            console.log("User created: ", user);
            socket.emit("userCreated", user);
        } catch (error) {
            console.error("Error creating user: ", error);
            socket.emit("userCreated", { error: error.message });
        }
    });






    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

httpServer.listen(3000);