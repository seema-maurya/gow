import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { FaMicrophone } from "react-icons/fa";

export default function Search(props) {
  const [searchInput, setSearchInput] = useState("");
  const [isListening, setIsListening] = useState(false);

  const navigate = useNavigate();

  const handleSearchKeyPress = (e) => {
    // if (e.key === "Enter" && searchInput.trim()) {
    e.preventDefault();
    if (searchInput.trim()) {
      const searchQuery = searchInput.toLowerCase().trim();

      // Use navigate to change the URL without reloading the page
      navigate(`/search-results?query=${searchQuery}`);
    }
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition(); // Or SpeechRecognition in non-WebKit browsers
    recognition.lang = "en-US";
    recognition.interimResults = false; // Only get final results
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setSearchInput(speechResult);
      // Automatically navigate if input is valid
      if (speechResult.trim()) {
        navigate(`/search-results?query=${speechResult.toLowerCase().trim()}`);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <form
        style={{ all: "unset", display: "inline" }}
        onSubmit={handleSearchKeyPress}
      >
        <input
          className="input-home-style"
          style={{
            borderRadius: "30px",
            width: "400px",
            marginLeft: "20px",
            backgroundColor: "white",
            paddingLeft: "10px",
          }}
          type="text"
          placeholder="Search type then press enter"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          // onKeyPress={handleSearchKeyPress}
          onKeyDown={(e) => e.key === "Enter" && handleSearchKeyPress(e)}
        />
        <FaMicrophone
          onClick={startListening}
          style={{
            position: "absolute",
            right: "10px",
            top: "45%",
            transform: "translateY(-50%)",
            border: "none",
            backgroundColor: "transparent",
            color: isListening ? "#727272" : "#ccc",
            cursor: "pointer",
          }}
          title="Click to Speak"
        />
      </form>
      {/* <span role="img" aria-label="microphone"></span> */}
    </div>
  );
}
