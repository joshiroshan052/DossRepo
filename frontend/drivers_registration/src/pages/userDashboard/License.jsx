import React, { useState, useEffect } from 'react';
import { getAllLicenseApi, deleteLicenseApi } from '../../apis/Api';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './License.css';
import ConfirmationMessage from './ConfirmationMessage';


const License = () => {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [licenseToDelete, setLicenseToDelete] = useState(null);

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    try {
      const loggedInUserId = JSON.parse(localStorage.getItem('user'))._id;
      const response = await getAllLicenseApi(loggedInUserId);
      setLicenses(response.data.license);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching licenses:', error);
      toast.error('Error fetching licenses');
    }
  };

  const handleDeleteConfirmation = (license) => {
    setLicenseToDelete(license);
    setConfirmationVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteLicenseApi(licenseToDelete._id);
      toast.success('License deleted successfully');
      setLicenses(licenses.filter((license) => license._id !== licenseToDelete._id));
    } catch (error) {
      console.error('Error deleting license:', error);
      toast.error('Error deleting license');
    } finally {
      setConfirmationVisible(false);
      setLicenseToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmationVisible(false);
    setLicenseToDelete(null);
  };

  return (
    <div className="license-container">
      <h2 className="license-title">License Entries</h2>
      {loading ? (
        <p>Loading...</p>
      ) : !licenses || licenses.length === 0 ? (
        <div className="no-licenses">
          <p>No license entries found.</p>
        </div>
      ) : (
        <div>
          {licenses.map((license) => (
            <div key={license._id} className="license-card">
              <label htmlFor="license-name">License Number: </label>
              <h3 className="license-name">{license.licenseName}</h3>
              <label htmlFor="license-status">License Status: </label>
              <h3 className="license-statsus">{license.licenseStatus}</h3>
              {license.licenseStatus === "Approved" && (
                
                <img
                  src={license.licenseImageUrl}
                  alt="License"
                  className="license-image"
                />
              )}
              {license.licenseStatus === "Not Approved" && (
                <p className="status-message">Waiting for admin approval. Image is shown only when admin approves.</p>
              )}
              <button onClick={() => handleDeleteConfirmation(license)}>Delete</button>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
      {confirmationVisible && (
        <ConfirmationMessage
          message="Are you sure you want to delete this license?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      {(!licenses || licenses.length === 0) && (
        <Link to="/license/create" className="create-license-link">
          Create License
        </Link>
      )}
    </div>
  );
};

export default License;
