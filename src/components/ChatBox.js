import React, { useState, useEffect, useRef } from "react";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [ws, setWs] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // State to toggle chat box visibility
  const chatBoxRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_API_URL_WS);
    console.log(socket);
    socket.onopen = () => {
      console.log("WebSocket connection established");
      setWs(socket);
    };

    socket.onmessage = (event) => {
      const botResponses = event.data
        .split("\n")
        .filter((response) => response.trim() !== "");
      const newMessages = botResponses.map((response) => ({
        text: response,
        sender: "bot",
      }));
      setMessages((prevMessages) => [...prevMessages, ...newMessages]);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatBoxRef.current && !chatBoxRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !ws) return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    ws.send(input);
    setInput("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div>
      {!isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: "10px",
            right: "10px",
            width: "50px",
            height: "50px",
            background: "#007bff",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            zIndex: 9999,
          }}
        >
          <span style={{ color: "#fff", fontSize: "24px" }}>💬</span>
        </div>
      )}
      {isOpen && (
        <div
          ref={chatBoxRef}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            width: "300px",
            height: "500px",
            position: "fixed",
            bottom: "10px",
            right: "10px",
            background: "rgb(231 224 224 / 96%)",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
            zIndex: 9999,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>Chat with us!</h3>
            <span
              onClick={() => setIsOpen(false)}
              style={{ cursor: "pointer" }}
            >
              ✖
            </span>
          </div>
          <div style={{ height: "300px", overflowY: "auto", padding: "5px" }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  marginBottom: "10px",
                }}
              >
                <p
                  style={{
                    display: "inline-block",
                    padding: "10px",
                    borderRadius: "10px",
                    maxWidth: "90%",
                    wordBreak: "break-word",
                    background: msg.sender === "user" ? "#007bff" : "#f1f1f1",
                    color: msg.sender === "user" ? "#fff" : "#000",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong>{" "}
                  {msg.text}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            onKeyDown={handleKeyPress}
            style={{ width: "100%", padding: "5px" }}
          />
          <button
            onClick={handleSend}
            style={{ width: "100%", padding: "5px" }}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
