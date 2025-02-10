// ConfirmationModal.js
import React from "react";
import "./confirmation-modal.css";

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        {console.log("Modal message:", message)}
        <p className="modal-message">{message || "Are you sure?"}</p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="confirm-button">Yes</button>
          <button onClick={onCancel} className="cancel-button">No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
