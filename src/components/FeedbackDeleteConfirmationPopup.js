// FeedbackDeleteConfirmationPopup.js

import React, { useState } from "react";
import "../css/DeleteConfirmationPopup.css";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import Feedback from "./Feedback";

const FeedbackDeleteConfirmationPopup = ({
  isOpen,
  onCancel,
  onConfirm,
  onInputChange,
}) => {
  const [confirmationText, setConfirmationText] = useState("");

  const handleConfirmationTextChange = (event) => {
    setConfirmationText(event.target.value);
    onInputChange(event); // Call the onInputChange prop
  };

  const handleConfirmClick = () => {
    if (confirmationText === "Delete") {
      onConfirm();
      setConfirmationText("");
    } else {
      // Notify the user about incorrect confirmation text
      toast.error("Please type 'Delete' to confirm deletion.");
    }
  };

  return (
    isOpen && (
      <div className="delete-confirmation-popup">
        <div className="close-button" onClick={onCancel}>
          <FaTimes />
        </div>

        <div className="confirmation-message">
          <h3 style={{ fontWeight: "bold" }}>
            <FaExclamationTriangle /> Delete Feedback
          </h3>
          <p>
            Are you sure you want to delete this {Feedback.Feedback} feedback?
          </p>
          <p>
            Type
            <strong> "Delete" </strong>to confirm :
          </p>
          <input
            placeholder="Delete"
            type="text"
            value={confirmationText}
            onChange={handleConfirmationTextChange}
          />
        </div>

        <div className="confirmation-buttons">
          <button onClick={handleConfirmClick}>Yes</button>
          <button onClick={onCancel}>No</button>
        </div>
      </div>
    )
  );
};

export default FeedbackDeleteConfirmationPopup;
