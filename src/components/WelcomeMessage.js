import React, { useEffect } from "react";
import "../css/Welcomemessage.css";
const WelcomeMessage = ({ onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 200000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="welcome-message">
      <h1>Welcome to GOW</h1>
    </div>
  );
};

export default WelcomeMessage;
