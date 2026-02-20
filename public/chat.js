// DOM Elements
const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const status = document.getElementById("status");

// Update status when user logs in/out
auth.onAuthStateChanged(user => {
    if (user) {
        if (status) status.textContent = `Connected as ${user.displayName || user.email}`;
    } else {
        if (status) status.textContent = "Please login to chat";
    }
});

// Send message to Firestore
sendBtn.addEventListener("click", () => {
    const msg = messageInput.value.trim();
    if (!msg) return;

    const user = auth.currentUser;
    if (!user) {
        alert("Login first to send messages!");
        return;
    }

    db.collection("messages").add({
        text: msg,
        userName: user.displayName || user.email,
        userId: user.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        messageInput.value = "";
    }).catch(err => {
        console.error("Error sending message:", err);
    });
});

// Display messages in real-time
db.collection("messages")
  .orderBy("timestamp")
  .onSnapshot(snapshot => {
      chatBox.innerHTML = ""; // clear chat
      snapshot.forEach(doc => {
          const data = doc.data();
          const div = document.createElement("div");
          div.classList.add("message");
          div.innerHTML = `<strong>${data.userName}:</strong> ${data.text}`;
          chatBox.appendChild(div);
      });
      chatBox.scrollTop = chatBox.scrollHeight; // scroll to bottom
  });