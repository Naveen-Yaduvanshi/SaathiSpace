const express = require("express");
const http = require("http");
const { Server } = require("socket.io");


require("dotenv").config();
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  })
});

const db = admin.firestore();


// Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: "*",  // Cloudflare frontend se allow
    methods: ["GET", "POST"]
  }
});

app.use(express.static("public"));

// Chat logic
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
    // Forward to partner
    if (socket.partner) {
      socket.partner.emit("chat message", msg);
    }

    // Save message in Firestore
    try {
      await db.collection("chats").add({
        message: msg,
        sender: socket.id,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
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

// Railway free tier port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
