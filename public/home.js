import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDlxxezRlr0cLXa_IlR78TBAn1Uxk9H9Hg",
  authDomain: "saathi-space.firebaseapp.com",
  projectId: "saathi-space",
  storageBucket: "saathi-space.firebasestorage.app",
  messagingSenderId: "47829329740",
  appId: "1:47829329740:web:f049c1bd8d316f2e8a91e9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Elements
const loginBtn = document.getElementById("openAuth");
const userArea = document.getElementById("userArea");
const userName = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");
const userAvatar = document.getElementById("userAvatar");

onAuthStateChanged(auth, async (user) => {
    if (user) {
        loginBtn.style.display = "none";
        userArea.style.display = "flex";

        // Firestore se firstName & lastName fetch karo
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        let firstName = "";
        if (docSnap.exists()) {
            const data = docSnap.data();
            firstName = data.firstName || "";
        } else {
            // fallback agar firestore me na ho
            const username = user.email.split("@")[0];
            const parts = username.split(".");
            firstName = parts[0] || "";
        
        }

        // Initials nikalna
        let initials = "";
        if(firstName ){
            initials = firstName[0] ;
        } else if(firstName){
            initials = firstName[0];
        } else {
            initials = "?";
        }

        initials = initials.toUpperCase();

        // UI me set karo
        userAvatar.textContent = initials;
        userAvatar.style.backgroundColor = getColorFromString(firstName);
    } else {
        loginBtn.style.display = "block";
        userArea.style.display = "none";
    }
});

// Color generator
function getColorFromString(str){
    let hash = 0;
    for(let i=0; i<str.length; i++){
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 50%)`;
    return color;
}

// Logout
logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.reload();
});
