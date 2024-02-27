import React from 'react';
import './LicenseModel.css';

const LicenseModel = ({ imageUrl, onClose }) => {
  return (
    <div className="license-modal-overlay" onClick={onClose}>
      <div className="license-modal">
        <img src={imageUrl} alt="Full License" className="license-modal-image" />
      </div>
    </div>
  );
};

export default LicenseModel;
