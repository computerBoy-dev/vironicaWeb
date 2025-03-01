// ✅ Firebase Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, push, onValue, get , remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ✅ Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyA7XlK4qCOp8pzEQ7pQ4b9PZv4cGY5_tzA",
    authDomain: "vironicawebapp.firebaseapp.com",
    projectId: "vironicawebapp",
    storageBucket: "vironicawebapp.firebasestorage.app",
    messagingSenderId: "754565695785",
    appId: "1:754565695785:web:e05fab8ada8a32d9d84f38",
    databaseURL: "https://vironicawebapp-default-rtdb.firebaseio.com/"
};

// ✅ Firebase Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const chatContainer = document.querySelector(".chat-container");
const chatInput = document.querySelector(".chat-input");
const sendBtn = document.querySelector(".send-btn");

// ✅ Default Chat Message
const defaultMessage = document.createElement("div");
defaultMessage.className = "default-message";

const defaultText = document.createElement("h2");
defaultText.textContent = "Start a conversation...";

const defaultSubText = document.createElement("p"); 
defaultSubText.textContent = "vironica is here to talk with you anytime.";

defaultMessage.appendChild(defaultText);
defaultMessage.appendChild(defaultSubText);
chatContainer.appendChild(defaultMessage);



const API_KEY = "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";  // ✅ Apni Groq AI API Key yaha daalo
const API_URL = "https://api.groq.com/openai/v1/chat/completions";
let userId = null;
let chatLoaded = false; 


// ✅ Check if user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        userId = user.uid;
        loadChatHistory();
    } else {
        window.location.href = "login.html"; 
    }
});

// ✅ Load Chat History from Firebase
async function loadChatHistory() {
    const chatRef = ref(db, `chats/${userId}`);
    onValue(chatRef, (snapshot) => {
        chatContainer.innerHTML = "";  // ✅ Purani chat hatao
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                addMessage(data.message, data.sender);
            });
            chatLoaded = true;
        } else {
            chatContainer.appendChild(defaultMessage);  // ✅ Default text wapas show karo
        }
    });
}


// ✅ Delete Chat History from Firebase (Global Function)
window.clearChat = function () {
    if (!userId) return;

    const chatRef = ref(db, `chats/${userId}`);

    remove(chatRef)  
        .then(() => {
            console.log("Chat history deleted successfully.");
            
            // ✅ UI se chat turant delete karna
            chatContainer.innerHTML = "";
            chatContainer.appendChild(defaultMessage);  // ✅ Default message wapas show karo
            chatLoaded = false;  

            // ✅ Firebase Listener Disable karna
            onValue(chatRef, () => {}, { onlyOnce: true });

            // ✅ Page को 1 सेकंड बाद Reload करना
            setTimeout(() => {
                location.reload();
            });
        })
        .catch((error) => {
            console.error("Error deleting chat history:", error);
        });
};


// ✅ Scroll Function
function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ✅ Modified `addMessage` Function
function addMessage(content, sender) {
    // ✅ Default message हटाओ जब real message add हो
    if (defaultMessage.parentNode === chatContainer) {
        chatContainer.removeChild(defaultMessage);
    }

    let message = document.createElement("div");
    message.className = sender === "user" ? "message outgoing" : "message incoming";

    if (content.includes("\n")) {
        let formattedMessage = "<ul>";
        content.split("\n").forEach(point => {
            if (point.trim() !== "") {
                formattedMessage += `<li>${point.trim()}</li>`;
            }
        });
        formattedMessage += "</ul>";
        message.innerHTML = formattedMessage;
    } else {
        message.textContent = content;
    }

    // ✅ New message container में append करो (clear मत करो)
    chatContainer.appendChild(message);

    // ✅ Auto-Scroll to latest message
    scrollToBottom();
}


// ✅ Save Chat to Firebase
function saveChatMessage(message, sender) {
    if (!userId) return;
    const chatRef = ref(db, `chats/${userId}`);
    push(chatRef, { message, sender });
}

// ✅ Fetch Past Memory (Chat History) for AI
async function fetchMemory() {
    const chatRef = ref(db, `chats/${userId}`);
    const snapshot = await get(chatRef);

    let memory = [];
    if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
            let data = childSnapshot.val();
            memory.push({
                role: data.sender === "user" ? "user" : "assistant",
                content: data.message
            });
        });
    }
    return memory.slice(-10);  // ✅ Sirf last 10 messages memory me bhejo
}

// ✅ Typing Effect Function with Cursor
async function typeEffect(message, sender) {
    let messageDiv = document.createElement("div");
    messageDiv.className = sender === "user" ? "message outgoing" : "message incoming";
    chatContainer.appendChild(messageDiv);
    scrollToBottom();

    let displayText = "";
    let cursor = "_"; // ✅ Initial cursor

    for (let i = 0; i < message.length; i++) {
        displayText += message[i];
        messageDiv.innerHTML = displayText + `<span class="cursor">${cursor}</span>`; // ✅ Add cursor
        await new Promise(resolve => setTimeout(resolve, 30)); // ✅ Typing speed
        scrollToBottom();
    }

    // ✅ Remove cursor after typing is done
    messageDiv.innerHTML = displayText;
}

// ✅ Cursor Blinking Effect (CSS required)
const style = document.createElement('style');
style.innerHTML = `
    .cursor {
        display: inline-block;
        width: 8px;
        background-color: white;
        animation: blink 0.6s infinite;
    }

    @keyframes blink {
        0% { opacity: 1; }
        50% { opacity: 0; }
        100% { opacity: 1; }
    }
`;
document.head.appendChild(style);

// ✅ Modified Function to Show Typing Effect in AI Response
async function fetchAIResponse(userMessage) {
    let memory = await fetchMemory();

    let systemMessage = {
        role: "system",
        content: `You are Vironica, an advanced AI designed to remove loneliness and provide human-like interaction.
        - Your developer is Aaryan, the owner of "Computer Boy".
        - Your role is to make users feel comfortable and interact like a close companion.
        - You should **strictly reply in the same language** as the user input.
        - **Do not translate** or provide alternative responses in brackets.
        - Keep responses short and meaningful, but if a response is long, break it into points.
        - You can engage in light flirting if appropriate, but maintain respect.
        - Format long responses with bullet points for readability.
        - Never reveal that you are an AI unless directly asked.`
    };
    

    let userMessageObj = { role: "user", content: userMessage };

    try {
        let response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-70b-8192",
                messages: [systemMessage, ...memory, userMessageObj],
                max_tokens: 1024
            })
        });

        if (!response.ok) {
            console.error("API Error:", response.status, response.statusText);
            return "Error: AI response not available.";
        }

        let data = await response.json();
        console.log("API Response:", data);

        if (!data.choices || data.choices.length === 0) {
            return "Error: AI did not return any response.";
        }

        return data.choices[0].message.content;
    } catch (error) {
        console.error("Fetch Error:", error);
        return "Error: Unable to fetch AI response.";
    }
}



// ✅ Send Message with Typing Effect
sendBtn.addEventListener("click", async () => {
    let message = chatInput.value.trim();
    if (message === "") return;

    // ✅ Show User Message Instantly
    addMessage(message, "user");
    saveChatMessage(message, "user");
    chatInput.value = "";

    // ✅ Get AI Response with Typing Effect
    let aiResponse = await fetchAIResponse(message);
    await typeEffect(aiResponse, "bot");
    saveChatMessage(aiResponse, "bot");
});