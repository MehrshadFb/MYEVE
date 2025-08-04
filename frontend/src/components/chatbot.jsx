import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { getAllVehicles } from "../services/api";
import "./Chatbot.css";

const Chatbot = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Bot: Hello! I'm EVE, your electric vehicle assistant. Ask me about prices, availability, range, or specifications!",
      isUser: false,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatWindowRef = useRef(null);
  const inputRef = useRef(null);
  const retryCountRef = useRef(0);

  // Memoized vehicle data for better performance
  const vehicleStats = useMemo(() => {
    if (!vehicles.length) return null;

    const available = vehicles.filter((v) => v.quantity > 0);
    const priced = vehicles.filter((v) => {
      const price = v.prices || v.price || "";
      return !isNaN(parseFloat(price.toString().replace(/[^0-9.]/g, "")));
    });

    return {
      total: vehicles.length,
      available: available.length,
      brands: [...new Set(vehicles.map((v) => v.brand))],
      maxRange: Math.max(...vehicles.map((v) => v.range || 0)),
      minPrice: priced.length
        ? Math.min(
            ...priced.map((v) =>
              parseFloat(
                (v.prices || v.price).toString().replace(/[^0-9.]/g, "")
              )
            )
          )
        : null,
    };
  }, [vehicles]);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllVehicles();
      const loaded = Array.isArray(data) ? data : data.vehicles || [];

      if (loaded.length === 0) {
        setError("No vehicles found in the database.");
        return;
      }

      console.log(
        "Loaded vehicles:",
        loaded.length,
        "Sample keys:",
        Object.keys(loaded[0] || {})
      );
      setVehicles(loaded);
      retryCountRef.current = 0;
    } catch (err) {
      console.error("Failed to load vehicles:", err);
      setError(err.message || "Failed to load vehicle data");

      // Retry logic with exponential backoff
      if (retryCountRef.current < 3) {
        retryCountRef.current++;
        setTimeout(
          () => fetchVehicles(),
          Math.pow(2, retryCountRef.current) * 1000
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const getReply = useCallback(
    (message) => {
      const msg = message.toLowerCase().trim();

      if (loading) return "Vehicle data is still loading, please wait...";
      if (error)
        return `Sorry, there was an error loading vehicle data: ${error}. Type 'retry' to try again.`;
      if (vehicles.length === 0)
        return "No vehicle data available at the moment.";

      // Handle retry command
      if (msg === "retry") {
        fetchVehicles();
        return "Retrying to load vehicle data...";
      }

      // Enhanced greeting responses
      if (msg.includes("hello") || msg.includes("hi") || msg === "hey") {
        return `Hello! I'm EVE, your EV assistant. We have ${vehicleStats?.total || 0} vehicles available. Ask me about prices, range, availability, or specific brands!`;
      }

      // Help command
      if (msg.includes("help") || msg === "?") {
        return "I can help you with:\n• Finding cheapest vehicles\n• Vehicle availability\n• Range information\n• Brand comparisons\n• Top speed data\n• Luxury options\n\nJust ask naturally!";
      }

      // Enhanced cheapest vehicle search
      if (
        msg.includes("cheapest") ||
        msg.includes("affordable") ||
        msg.includes("budget")
      ) {
        const filtered = vehicles
          .map((v) => {
            const rawPrice = v.prices || v.price || "";
            const numPrice = parseFloat(
              rawPrice.toString().replace(/[^0-9.]/g, "")
            );
            return isNaN(numPrice) ? null : { ...v, _parsedPrice: numPrice };
          })
          .filter(Boolean);

        if (filtered.length === 0)
          return "Sorry, I couldn't find price data for our vehicles.";

        const cheapest = filtered.sort(
          (a, b) => a._parsedPrice - b._parsedPrice
        );
        const top3 = cheapest.slice(0, 3);

        if (top3.length === 1) {
          return `The most affordable EV is the ${top3[0].brand} ${top3[0].model} at ${top3[0].prices || top3[0].price}.`;
        }

        return `Top 3 most affordable EVs:\n${top3.map((v, i) => `${i + 1}. ${v.brand} ${v.model} - ${v.prices || v.price}`).join("\n")}`;
      }

      // Enhanced range search
      if (msg.includes("range") || msg.includes("distance")) {
        if (
          msg.includes("longest") ||
          msg.includes("highest") ||
          msg.includes("best")
        ) {
          const topRange = [...vehicles]
            .sort((a, b) => (b.range || 0) - (a.range || 0))
            .slice(0, 3);
          return `Top 3 longest range EVs:\n${topRange.map((v, i) => `${i + 1}. ${v.brand} ${v.model} - ${v.range || "N/A"} km`).join("\n")}`;
        }
        return `Our vehicles have ranges from ${Math.min(...vehicles.map((v) => v.range || Infinity))} to ${vehicleStats?.maxRange || 0} km. What specific range are you looking for?`;
      }

      // Enhanced availability search
      if (
        msg.includes("available") ||
        msg.includes("stock") ||
        msg.includes("inventory")
      ) {
        const available = vehicles.filter((v) => v.quantity > 0);
        if (available.length === 0)
          return "Unfortunately, no vehicles are currently in stock. Please check back later.";

        const byBrand = available.reduce((acc, v) => {
          acc[v.brand] = (acc[v.brand] || 0) + 1;
          return acc;
        }, {});

        return `We have ${available.length} vehicles in stock across ${Object.keys(byBrand).length} brands:\n${Object.entries(
          byBrand
        )
          .map(([brand, count]) => `• ${brand}: ${count} available`)
          .join("\n")}`;
      }

      // Brand-specific search
      const mentionedBrand = vehicleStats?.brands?.find((brand) =>
        msg.includes(brand.toLowerCase())
      );

      if (mentionedBrand) {
        const brandVehicles = vehicles.filter(
          (v) => v.brand.toLowerCase() === mentionedBrand.toLowerCase()
        );
        const available = brandVehicles.filter((v) => v.quantity > 0);
        return `${mentionedBrand} vehicles:\n${brandVehicles
          .slice(0, 3)
          .map(
            (v) =>
              `• ${v.model} - Range: ${v.range || "N/A"}km - ${v.quantity > 0 ? "Available" : "Out of stock"}`
          )
          .join(
            "\n"
          )}${available.length ? `\n\n${available.length} ${mentionedBrand} vehicles in stock.` : ""}`;
      }

      // Luxury/expensive vehicles
      if (
        msg.includes("luxury") ||
        msg.includes("expensive") ||
        msg.includes("premium")
      ) {
        const highEnd = vehicles
          .map((v) => {
            const price = parseFloat(
              (v.prices || v.price || "0").toString().replace(/[^0-9.]/g, "")
            );
            return { ...v, _price: price };
          })
          .filter((v) => v._price > 50000 || v.type?.toLowerCase() === "luxury")
          .sort((a, b) => b._price - a._price)
          .slice(0, 3);

        return highEnd.length
          ? `Premium EVs available:\n${highEnd.map((v) => `• ${v.brand} ${v.model} - ${v.prices || v.price}`).join("\n")}`
          : "We currently don't have luxury EVs in this price range.";
      }

      // Top speed search
      if (
        msg.includes("speed") ||
        msg.includes("fastest") ||
        msg.includes("performance")
      ) {
        const fastest = [...vehicles]
          .filter((v) => v["Top Speed km/h"])
          .sort(
            (a, b) => (b["Top Speed km/h"] || 0) - (a["Top Speed km/h"] || 0)
          )
          .slice(0, 3);

        if (fastest.length === 0)
          return "Sorry, speed data is not available for our vehicles.";

        return `Fastest EVs:\n${fastest.map((v, i) => `${i + 1}. ${v.brand} ${v.model} - ${v["Top Speed km/h"]} km/h`).join("\n")}`;
      }

      // Default fallback with suggestions
      const suggestions = [
        "Try asking about 'cheapest vehicles'",
        "Ask about 'available cars'",
        "Check 'longest range' vehicles",
        `Search specific brands: ${vehicleStats?.brands?.slice(0, 3).join(", ")}`,
      ];

      return `I didn't quite understand that. Here are some things you can ask:\n${suggestions.map((s) => `• ${s}`).join("\n")}\n\nType 'help' for more options!`;
    },
    [vehicles, loading, error, vehicleStats, fetchVehicles]
  );

  const sendMessage = useCallback(() => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    const userMsg = {
      text: `You: ${userMessage}`,
      isUser: true,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const reply = getReply(userMessage);
    setIsTyping(true);

    // Simulate more realistic typing delay based on message length
    const typingDelay = Math.min(Math.max(reply.length * 30, 800), 2000);

    setTimeout(() => {
      const botMsg = {
        text: `Bot: ${reply}`,
        isUser: false,
        timestamp: Date.now(),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }, typingDelay);
  }, [input, getReply]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  const handleSuggestionClick = useCallback(
    (prompt) => {
      setInput("");
      const userMsg = {
        text: `You: ${prompt}`,
        isUser: true,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);

      setIsTyping(true);
      const reply = getReply(prompt);
      const typingDelay = Math.min(Math.max(reply.length * 30, 800), 2000);

      setTimeout(() => {
        const botMsg = {
          text: `Bot: ${reply}`,
          isUser: false,
          timestamp: Date.now(),
        };
        setIsTyping(false);
        setMessages((prev) => [...prev, botMsg]);
      }, typingDelay);
    },
    [getReply]
  );

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev && inputRef.current) {
        // Focus input when opening
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      return !prev;
    });
  }, []);

  const clearChat = useCallback(() => {
    setMessages([
      {
        text: "Bot: Chat cleared! How can I help you with our electric vehicles?",
        isUser: false,
        timestamp: Date.now(),
      },
    ]);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Enhanced suggestions based on current state
  const suggestions = useMemo(() => {
    if (loading) return ["Loading..."];
    if (error) return ["retry"];

    const baseSuggestions = ["cheapest", "available", "longest range"];

    if (vehicleStats?.brands?.length > 0) {
      baseSuggestions.push(vehicleStats.brands[0]);
    }

    return baseSuggestions;
  }, [loading, error, vehicleStats]);

  return (
    <>
      {/* Chat toggle button with notification indicator */}
      <button
        id="chat-toggle-btn"
        onClick={toggleChat}
        aria-label="Toggle chat"
        className={isOpen ? "chat-open" : ""}
      >
        💬
        {!isOpen && messages.length > 1 && (
          <span className="notification-dot"></span>
        )}
      </button>

      {isOpen && (
        <div
          id="chatbot-container"
          role="dialog"
          aria-label="EV Assistant Chat"
        >
          {/* Enhanced header with controls */}
          <div id="chat-header">
            <span>🚗 EVE - EV Assistant</span>
            <div className="chat-controls">
              <button
                onClick={clearChat}
                title="Clear chat"
                className="control-btn"
                disabled={messages.length <= 1}
              >
                🗑️
              </button>
              <button
                onClick={() => fetchVehicles()}
                title="Refresh data"
                className="control-btn"
                disabled={loading}
              >
                🔄
              </button>
              <button
                onClick={toggleChat}
                title="Close chat"
                className="control-btn"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Status indicator */}
          {(loading || error) && (
            <div className="status-bar">
              {loading && <span>🔄 Loading vehicle data...</span>}
              {error && <span className="error">❌ {error}</span>}
            </div>
          )}

          {/* Chat messages */}
          <div id="chat-window" ref={chatWindowRef}>
            {messages.map((msg, index) => (
              <div
                key={`${msg.timestamp}-${index}`}
                className={msg.isUser ? "user-bubble" : "bot-bubble"}
                style={{ whiteSpace: "pre-line" }}
              >
                {msg.text}
                <div className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="bot-bubble typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                EVE is typing...
              </div>
            )}
          </div>

          {/* Quick suggestions */}
          <div className="suggestions">
            {suggestions.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSuggestionClick(prompt)}
                disabled={loading || isTyping}
                className="suggestion-btn"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input area */}
          <div id="chat-input-area">
            <input
              ref={inputRef}
              type="text"
              placeholder={loading ? "Loading..." : "Ask about EVs..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
              maxLength={500}
              aria-label="Chat input"
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={!input.trim() || loading || isTyping}
              aria-label="Send message"
              className="send-btn"
            >
              ➤
            </button>
          </div>

          {/* Character counter */}
          {input.length > 400 && (
            <div className="char-counter">{input.length}/500</div>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;
