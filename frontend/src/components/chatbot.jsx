import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css"; // We'll define styles here

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatWindowRef = useRef(null);

  const getReply = (message) => {
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
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { text: `You: ${input}`, isUser: true };
    const botMsg = { text: `Bot: ${getReply(input)}`, isUser: false };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <button id="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        💬
      </button>

      {isOpen && (
        <div id="chatbot-container">
          <div id="chat-header">🔋 EV Assistant</div>
          <div id="chat-window" ref={chatWindowRef}>
            {messages.map((msg, index) => (
              <div key={index} className={msg.isUser ? "user-bubble" : "bot-bubble"}>
                {msg.text}
              </div>
            ))}
          </div>
          <div id="chat-input-area">
            <input
              type="text"
              placeholder="Ask about EVs..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
