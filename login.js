import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;
            const overlay = document.getElementById("overlay");
            const overlayText = document.getElementById("overlay-text");

            overlayText.textContent = "Logging in...";
            overlay.classList.add("active");

            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    window.location.href = "chat.html"; // Redirect on success
                })
                .catch((error) => {
                    overlayText.textContent = "Invalid credentials. Try again.";
                    setTimeout(() => {
                        overlay.classList.remove("active");
                    }, 2000);
                });
        });
    } else {
        console.error("Error: loginForm not found!");
    }
});

window.onload = function() {
    setTimeout(function() {
        document.querySelector('.loader-container').style.opacity = '0';
        setTimeout(function() {
            document.querySelector('.loader-container').style.display = 'none';
        }, 1000);
    }, 1000);
};