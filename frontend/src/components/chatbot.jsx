import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/vehicles")
      .then((res) => res.json())
      .then((data) => {
        const loaded = Array.isArray(data) ? data : data.vehicles || [];
        console.log("Sample vehicle keys:", Object.keys(loaded[0] || {}));
        setVehicles(loaded);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load vehicles:", err);
        setLoading(false);
      });
  }, []);

  const getReply = (message) => {
    const msg = message.toLowerCase();

    if (loading) return "Vehicle data is still loading...";
    if (vehicles.length === 0) return "No vehicle data available.";

    if (msg.includes("cheapest")) {
      const filtered = vehicles
        .map((v) => {
          const rawPrice = v.prices || v.price || "";
          const numPrice = parseFloat(rawPrice.toString().replace(/[^0-9.]/g, ""));
          return isNaN(numPrice) ? null : { ...v, _parsedPrice: numPrice };
        })
        .filter(Boolean);

      if (filtered.length === 0) return "Sorry, I couldn't find price data for our vehicles.";

      const cheapest = filtered.sort((a, b) => a._parsedPrice - b._parsedPrice)[0];
      return `The cheapest EV we have is the ${cheapest.brand} ${cheapest.model} at ${cheapest.prices || cheapest.price}.`;
    }

    if (msg.includes("longest range") || msg.includes("highest range")) {
      const topRange = [...vehicles].sort((a, b) => b.range - a.range)[0];
      return `${topRange.brand} ${topRange.model} has the longest range of ${topRange.range} km.`;
    }

    if (msg.includes("available") || msg.includes("availability") || msg.includes("avalabilities")) {
      const available = vehicles.filter((v) => v.quantity > 0);
      if (available.length === 0) return "No vehicles are currently available.";
      return `We currently have ${available.length} vehicles in stock. Example: ${available[0].brand} ${available[0].model}.`;
    }

    if (msg.includes("luxury") || msg.includes("expensive")) {
      const highEnd = vehicles.filter(v => v.type?.toLowerCase() === "luxury");
      return highEnd.length
        ? `Some luxury EVs include: ${highEnd.slice(0, 3).map(v => `${v.brand} ${v.model}`).join(", ")}`
        : "We currently don't have luxury EVs.";
    }

    if (msg.includes("top speed") || msg.includes("fastest")) {
      const fastest = [...vehicles].sort((a, b) => b["Top Speed km/h"] - a["Top Speed km/h"])[0];
      return `${fastest.brand} ${fastest.model} has a top speed of ${fastest["Top Speed km/h"]} km/h.`;
    }

    return "Hello! Ask me about our vehicle prices, availability, or range!";
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { text: `You: ${input}`, isUser: true };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const reply = getReply(input);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = { text: `Bot: ${reply}`, isUser: false };
      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }, 1800);
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
          <div id="chat-header">My EVE</div>
          <div id="chat-window" ref={chatWindowRef}>
            {messages.map((msg, index) => (
              <div key={index} className={msg.isUser ? "user-bubble" : "bot-bubble"}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="bot-bubble">Loading vehicle data...</div>
            )}
            {isTyping && <div className="bot-bubble typing">Bot is typing...</div>}
          </div>

          <div className="suggestions">
            {["cheapest", "longest range", "available"].map((prompt) => (
              <button
                key={prompt}
                onClick={() => {
                  setInput("");
                  const userMsg = { text: `You: ${prompt}`, isUser: true };
                  setMessages((prev) => [...prev, userMsg]);

                  setIsTyping(true);
                  setTimeout(() => {
                    const botMsg = { text: `Bot: ${getReply(prompt)}`, isUser: false };
                    setIsTyping(false);
                    setMessages((prev) => [...prev, botMsg]);
                  }, 1800);
                }}
              >
                {prompt}
              </button>
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
            <button type="button" onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
