const socket = io(saathispace-production.up.railway.app);

const chatBox = document.getElementById("chatBox");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const status = document.getElementById("status");

function addMessage(text, type) {
    const div = document.createElement("div");
    div.classList.add("message", type);
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.onclick = () => {
    const msg = input.value.trim();
    if (!msg) return;

    socket.emit("chat message", msg);
    addMessage(msg, "sent");
    input.value = "";
};

socket.on("chat message", (msg) => {
    addMessage(msg, "received");
});

socket.on("status", (msg) => {
    if (status) status.textContent = msg;
});
