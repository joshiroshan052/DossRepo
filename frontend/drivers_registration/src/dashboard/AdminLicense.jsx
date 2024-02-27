// AdminLicense.jsx

import React, { useState, useEffect } from 'react';
import { getAllLicensesApi, updateLicenseStatusApi } from "../apis/Api";
import { toast } from "react-toastify";
import "./AdminLicense.css";

const AdminLicense = () => {
  const [licenses, setLicenses] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchAllLicenses();
  }, []);

  const fetchAllLicenses = async () => {
    try {
      const response = await getAllLicensesApi();
      setLicenses(response.data.license);
    } catch (error) {
      console.error('Error fetching license:', error);
      toast.error('Error fetching license');
    }
  };

  const handleUpdateStatus = async (licenseId, newStatus) => {
    try {
      const response = await updateLicenseStatusApi(licenseId, { licenseStatus: newStatus });
      console.log(response.data); // Log the response data to check if it's successful
      setLicenses(prevLicenses =>
        prevLicenses.map(license =>
          license._id === licenseId ? { ...license, licenseStatus: newStatus } : license
        )
      );
      toast.success('License status updated successfully');
    } catch (error) {
      console.error('Error updating license status:', error);
      toast.error('Error updating license status');
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  return (
    <div className="admin-license">
      <h2>All Licenses</h2>
      <ul className="license-list">
        {licenses.map(license => (
          <li key={license._id} className="license-item">
            <div className="license-details">
              <h3>{license.licenseName}</h3>
              <p>Status: {license.licenseStatus}</p>
            </div>
            <div className="license-image">
              <img
                src={license.licenseImageUrl}
                alt={license.licenseName}
                onClick={() => handleImageClick(license.licenseImageUrl)}
              />
            </div>
            <div className="button-container-license">
              <button className="approve-button-license" onClick={() => handleUpdateStatus(license._id, "Approved")}>Approve</button>
              <button className="reject-button-license" onClick={() => handleUpdateStatus(license._id, "Not Approved")}>Reject</button>
            </div>
          </li>
        ))}
      </ul>
      {selectedImage && (
        <div className="full-image-overlay" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Full License" />
        </div>
      )}
    </div>
  );
};

export default AdminLicense;
