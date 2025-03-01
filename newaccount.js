import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyA7XlK4qCOp8pzEQ7pQ4b9PZv4cGY5_tzA",
    authDomain: "vironicawebapp.firebaseapp.com",
    projectId: "vironicawebapp",
    storageBucket: "vironicawebapp.firebasestorage.app",
    messagingSenderId: "754565695785",
    appId: "1:754565695785:web:e05fab8ada8a32d9d84f38"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signupForm");
    const overlay = document.getElementById("overlay");
    const overlayText = document.getElementById("overlay-text");

    if (!signupForm) {
        console.error("Error: signupForm not found!");
        return;
    }

    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        overlayText.textContent = "Creating account...";
        overlay.classList.add("active");

        const email = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                overlayText.textContent = "Account created! Redirecting...";
                setTimeout(() => {
                    window.location.href = "chat.html"; // ✅ Redirect after showing success message
                }, 1500);
            })
            .catch((error) => {
                overlayText.textContent = "Signup failed. Try again.";
                console.error("Signup Error:", error);
                setTimeout(() => {
                    overlay.classList.remove("active");
                }, 2000);
            });
    });
});


window.onload = function () {
    setTimeout(function () {
        document.querySelector('.loader-container').style.opacity = '0';
        setTimeout(function () {
            document.querySelector('.loader-container').style.display = 'none';
        }, 1000);
    }, 2000);
};
