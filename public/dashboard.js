import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDlxxezRlr0cLXa_IlR78TBAn1Uxk9H9Hg",
  authDomain: "saathi-space.firebaseapp.com",
  projectId: "saathi-space",
  storageBucket: "saathi-space.firebasestorage.app",
  messagingSenderId: "47829329740",
  appId: "1:47829329740:web:24ef388ce011b4bf8a91e9",
  measurementId: "G-E9Z4BXDRJ8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, (user) => {
    if (user) {
        userEmail.textContent = "Logged in as: " + user.email;
    } else {
        window.location.href = "index.html";
    }
});

logoutBtn.onclick = () => signOut(auth);
