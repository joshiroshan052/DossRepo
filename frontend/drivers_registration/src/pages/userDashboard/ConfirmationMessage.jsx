// ConfirmationMessage.js

import React from 'react';
import './ConfirmationMessage.css';

const ConfirmationMessage = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-message-container">
      <div className="confirmation-message-content">
        <p>{message}</p>
        <div className="button-group">
          <button onClick={onConfirm}>Confirm</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationMessage;
