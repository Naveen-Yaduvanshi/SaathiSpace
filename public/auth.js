import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// Firebase config
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
const overlay = document.getElementById("authOverlay");
const openBtn = document.getElementById("openAuth");
const closeBtn = document.getElementById("closeAuth");
const form = document.getElementById("authForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const switchMode = document.getElementById("switchMode");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const toggleText = document.getElementById("toggleText");

let isSignup = false;

// Open/Close popup
openBtn.addEventListener("click", () => overlay.style.display = "flex");
closeBtn.addEventListener("click", () => overlay.style.display = "none");

// Toggle login/signup
switchMode.addEventListener("click", () => {
    isSignup = !isSignup;
    if(isSignup){
        formTitle.textContent = "Sign Up";
        submitBtn.textContent = "Sign Up";
        toggleText.textContent = "Already have an account?";
        switchMode.textContent = "Login";
    } else {
        formTitle.textContent = "Login";
        submitBtn.textContent = "Login";
        toggleText.textContent = "Don’t have an account?";
        switchMode.textContent = "Sign Up";
    }
});

// Helper function: Split email or name into first & last
function splitName(name) {
    const parts = name.split(" ");
    let firstName = parts[0] || name[0];
    return { firstName };
}

// Form submit

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userEmail = email.value;
    const userPassword = password.value;

    try {
        if(isSignup){
            // 1️⃣ Create user in Auth
            const userCredential = await createUserWithEmailAndPassword(auth, userEmail, userPassword);
            const user = userCredential.user;

            // 2️⃣ Prepare first & last name
            const defaultName = userEmail.split("@")[0]; // "john.doe"
            const { firstName } = splitName(defaultName.replace(".", " "));

            // 3️⃣ Add user in Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                firstName: firstName,
                createdAt: new Date()
            });

            alert("Signup successful!");
        } else {
            await signInWithEmailAndPassword(auth, userEmail, userPassword);
        }

        overlay.style.display = "none";
        window.location.reload(); // Update homepage UI
    } catch(error){
        alert(error.message);
    }
});
