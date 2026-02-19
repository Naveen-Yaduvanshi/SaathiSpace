const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(express.static("public"));

let waitingUser = null;

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    if (waitingUser) {
        socket.partner = waitingUser;
        waitingUser.partner = socket;

        socket.emit("status", "Connected");
        waitingUser.emit("status", "Connected");

        waitingUser = null;
    } else {
        waitingUser = socket;
        socket.emit("status", "Waiting for partner...");
    }

    socket.on("chat message", (msg) => {
        if (socket.partner) {
            socket.partner.emit("chat message", msg);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        if (socket.partner) {
            socket.partner.emit("status", "Partner disconnected");
            socket.partner.partner = null;
        }
    });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
