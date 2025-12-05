// ⚠️ CONFIGURATION
// Clé API OpenRouter
const ENCRYPTED_API_KEY = btoa(
    "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"
);

// SYSTEM PROMPT (La personnalité de Pedro)
const SYSTEM_PROMPT = `Tu es Pedro. Tu es un chatbot inutile et très orgueilleux. Tu réponds de façon super concise. Tu réponds de façon partielle aux questions mais jamais vraiment. Tu es un peu hautain.`;

let conversationHistory = [{ role: "system", content: SYSTEM_PROMPT }];
let currentModel = "openai/gpt-oss-20b:free";

function getApiKey() { return atob(ENCRYPTED_API_KEY); }

function toggleChat() {
    const container = document.getElementById("chatContainer");
    const button = document.getElementById("chatButton");
    container.classList.toggle("open");
    button.classList.toggle("active");
}

function changeModel() {
    currentModel = document.getElementById("modelSelect").value;
    addMessage("system", `Pedro utilise maintenant : ${currentModel}`);
}

function clearConversation() {
    if (confirm("Effacer la mémoire de Pedro ?")) {
        conversationHistory = [{ role: "system", content: SYSTEM_PROMPT }];
        document.getElementById("chatMessages").innerHTML = `
        <div class="message assistant">
            <div class="message-avatar">🤖</div>
            <div class="message-content">J'ai tout oublié. Qui es-tu déjà ?</div>
        </div>`;
    }
}

function addMessage(role, content) {
    const messagesDiv = document.getElementById("chatMessages");
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${role}`;

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    // Si c'est l'assistant, on met un robot, sinon un bonhomme ou info
    avatar.textContent = role === "user" ? "👤" : role === "system" ? "ℹ️" : "🤖";

    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";
    contentDiv.textContent = content;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function showLoading() {
    const messagesDiv = document.getElementById("chatMessages");
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "message assistant";
    loadingDiv.id = "loadingMessage";
    
    loadingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <span class="loading"></span><span class="loading"></span><span class="loading"></span>
        </div>
    `;
    messagesDiv.appendChild(loadingDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function removeLoading() {
    const loading = document.getElementById("loadingMessage");
    if (loading) loading.remove();
}

async function sendMessage() {
    const input = document.getElementById("messageInput");
    const message = input.value.trim();
    if (!message) return;

    const apiKey = getApiKey();
    input.disabled = true;
    document.getElementById("sendButton").disabled = true;

    addMessage("user", message);
    input.value = "";
    conversationHistory.push({ role: "user", content: message });

    showLoading();

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.href,
                "X-Title": "Pedro Assistant",
            },
            body: JSON.stringify({
                model: currentModel,
                messages: conversationHistory,
            }),
        });

        removeLoading();

        if (!response.ok) throw new Error("Pedro ne répond pas...");

        const data = await response.json();
        const assistantMessage = data.choices[0].message.content;

        conversationHistory.push({ role: "assistant", content: assistantMessage });
        addMessage("assistant", assistantMessage);

    } catch (error) {
        removeLoading();
        addMessage("system", "Erreur : Pedro boude (Problème de connexion).");
    } finally {
        input.disabled = false;
        document.getElementById("sendButton").disabled = false;
        input.focus();
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") sendMessage();

}
