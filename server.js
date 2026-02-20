const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const admin = require("firebase-admin");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Firebase initialize
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const db = admin.firestore();

// Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
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

  socket.on("chat message", async (msg) => {
    if (socket.partner) {
      socket.partner.emit("chat message", msg);
    }

    try {
      await db.collection("chats").add({
        message: msg,
        sender: socket.id,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (err) {
      console.error("Firestore write error:", err);
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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
