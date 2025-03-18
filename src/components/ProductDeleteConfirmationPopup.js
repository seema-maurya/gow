import React from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";
import "../css/DeleteConfirmationPopup.css";
import { toast } from "react-toastify";

const ProductDeleteConfirmationPopup = ({
  isOpen,
  product,
  onCancel,
  onConfirm,
  enteredProductName,
  handleChange,
}) => {
  const handleConfirmation = () => {
    if (enteredProductName.trim() === product.brandName.trim()) {
      onConfirm();
      console.log("Successfully deleted");
    } else {
      toast.error("Brand name does not match. Deletion cancelled.");
    }
  };

  return isOpen ? (
    <div className="delete-confirmation-popup">
      <div className="close-button" onClick={onCancel}>
        <FaTimes />
      </div>

      <div className="confirmation-message">
        <h3 style={{ fontWeight: "bold" }}>
          <FaExclamationTriangle /> Delete Collection
        </h3>
        Are you sure you want to delete{" "}
        <strong>"{product.brandName}" data</strong> ? <br />
        Type "{product.brandName}" to confirm your action.
        <div className="">
          <input
            type="text"
            placeholder="Enter brand name"
            value={enteredProductName}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="confirmation-buttons">
        <button onClick={handleConfirmation}>Yes</button>
        <button onClick={onCancel}>No</button>
      </div>
    </div>
  ) : null;
};

export default ProductDeleteConfirmationPopup;
