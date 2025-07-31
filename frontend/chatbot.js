function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  appendToChat("You: " + message, true);  // 👈 Pass isUser = true
  input.value = "";

  let reply = getReply(message);
  appendToChat("Bot: " + reply);
}

window.sendMessage = sendMessage; 

function appendToChat(text, isUser = false) {
  const chat = document.getElementById("chat-window");
  const div = document.createElement("div");
  div.textContent = text;
  div.className = isUser ? "user-bubble" : "bot-bubble";
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function getReply(message) {
  const msg = message.toLowerCase();
  if (msg.includes("ev") || msg.includes("electric vehicle")) {
    return "We offer a range of EVs including cars, bikes, and scooters. What are you interested in?";
  }
  if (msg.includes("price") || msg.includes("cost")) {
    return "Our EVs range from $5,000 to $80,000. Would you like help choosing based on budget?";
  }
  if (msg.includes("charge")) {
    return "Most EVs take 30–60 minutes to fast charge. Want to know about home charging?";
  }
  return "Hello! I'm here to help with anything about our EVs or accessories!";
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("user-input");
  input.focus();
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

});

document.addEventListener("DOMContentLoaded", () => {
  const chatToggleBtn = document.getElementById("chat-toggle-btn");
  const chatbotContainer = document.getElementById("chatbot-container");

  chatToggleBtn.addEventListener("click", () => {
    const isVisible = chatbotContainer.style.display === "flex";
    chatbotContainer.style.display = isVisible ? "none" : "flex";
  });

  // Optional: Pressing enter also sends message
  const input = document.getElementById("user-input");
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});
