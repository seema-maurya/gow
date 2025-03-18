// DeleteConfirmationPopup.js
import React from "react";
import "../css/DeleteConfirmationPopup.css";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

const DeleteConfirmationPopup = ({
  isOpen,
  mobileNumber,
  onCancel,
  onConfirm,
  onMobileNumberChange,
}) => {
  return (
    isOpen && (
      <div className="delete-confirmation-popup">
        <div className="close-button" onClick={onCancel}>
          <FaTimes />
        </div>

        <div className="confirmation-message">
          <h3 style={{ fontWeight: "bold" }}>
            <FaExclamationTriangle /> Delete Collection
          </h3>
          Are you sure you want to delete collection{" "}
          <strong>"{mobileNumber}" repair?</strong>
          <br />
          Type "{mobileNumber}" to confirm your action
        </div>
        <div className="mobile-number">
          <input
            type="text"
            placeholder="Enter repair mobile number"
            // value={mobileNumber}
            onChange={onMobileNumberChange}
          />
        </div>
        <div className="confirmation-buttons">
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onCancel}>No</button>
        </div>
      </div>
    )
  );
};

export default DeleteConfirmationPopup;
