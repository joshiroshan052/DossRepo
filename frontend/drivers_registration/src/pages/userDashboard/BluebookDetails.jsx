import React, { useState, useEffect } from 'react';
import { getSingleBluebookApi, updateBluebookApi, deleteBluebookApi } from "../../apis/Api";
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "./BluebookDetails.css";
import ConfirmationMessage from './ConfirmationMessage'; 

const BluebookDetails = () => {
  const { bluebookId } = useParams();
  const navigate = useNavigate();
  const [bluebook, setBluebook] = useState(null);
  const [formData, setFormData] = useState(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false); // State to manage visibility of confirmation message
  const [bluebookToDelete, setBluebookToDelete] = useState(null); // State to store the license to be deleted
  const [isModified, setIsModified] = useState(false); // State to track if any field has been modified

  useEffect(() => {
    fetchBluebookDetails();
  }, [bluebookId]);

  const fetchBluebookDetails = async () => {
    try {
      const response = await getSingleBluebookApi(bluebookId);
      const bluebookData = response.data.bluebook;

      // Convert date strings to the desired format (mm/dd/yyyy)
      const formattedFormData = {
        ...bluebookData,
        taxPaid: formatDate(bluebookData.taxPaid),
        validUpTo: formatDate(bluebookData.validUpTo)
      };

      setBluebook(bluebookData);
      setFormData(formattedFormData);
    } catch (error) {
      console.error('Error fetching bluebook details:', error);
      toast.error('Error fetching bluebook details');
    }
  };

  // Function to format date string from yyyy-mm-ddT00:00:00.000+00:00 to mm/dd/yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };  

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'taxPaid' || name === 'validUpTo') {
      setIsModified(true);
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    if (!isModified) {
      toast.error('No changes were made.');
      return;
    }

    try {
      await updateBluebookApi(bluebookId, formData);
      toast.success('Bluebook details updated successfully');
      navigate();
    } catch (error) {
      console.error('Error updating bluebook details:', error);
      toast.error('Error updating bluebook details');
    }
  };

  const handleDeleteConfirmation = (license) => {
    setBluebookToDelete(license);
    setConfirmationVisible(true);
  };

  const handleDelete = async () => {
    try {
      await deleteBluebookApi(bluebookId);
      toast.success('Bluebook deleted successfully');
      navigate('/dashboards');
    } catch (error) {
      console.error('Error deleting bluebook:', error);
      toast.error('Error deleting bluebook');
    } finally {
      setConfirmationVisible(false);
      setBluebookToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmationVisible(false);
    setBluebookToDelete(null);
  };

  if (!bluebook) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bluebook-details">
      <h2>Bluebook Details</h2>
      <form className="bluebook-form">
        <div className="form-group">
          <label htmlFor="bluebookName">Owner Name:</label>
          <input type="text" id="bluebookName" name="bluebookName" value={formData.bluebookName} readOnly />
        </div>
        <div className="form-group">
          <label htmlFor="registrationAuthority">Registration Authority:</label>
          <input type="text" id="registrationAuthority" name="registrationAuthority" value={formData.registrationAuthority} readOnly />
        </div>
        <div className="form-group">
          <label htmlFor="vehicleClass">Vehicle Class (CC):</label>
          <input type="text" id="vehicleClass" name="vehicleClass" value={formData.vehicleClass} readOnly />
        </div>
        <div className="form-group">
          <label htmlFor="fuelType">Fuel Type:</label>
          <input type="text" id="fuelType" name="fuelType" value={formData.fuelType} readOnly />
        </div>
        <div className="form-group">
          <label htmlFor="vehicleManufactured">Vehicle Manufactured Year:</label>
          <input type="number" id="vehicleManufactured" name="vehicleManufactured" value={formData.vehicleManufactured} readOnly />
        </div>
        <div className="form-group">
          <label htmlFor="taxPaid" className="changeable-label">Tax Paid:</label>
          <input type="date" id="taxPaid" name="taxPaid" value={formData.taxPaid} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="validUpTo" className="changeable-label">Valid Up To:</label>
          <input type="date" id="validUpTo" name="validUpTo" value={formData.validUpTo} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="chassisNumber">Chassis Number:</label>
          <input type="text" id="chassisNumber" name="chassisNumber" value={formData.chassisNumber} readOnly />
        </div>
        <div className="form-group">
          <label htmlFor="engineNumber">Engine Number:</label>
          <input type="text" id="engineNumber" name="engineNumber" value={formData.engineNumber} readOnly />
        </div>
        <div className="button-group">
          <button type="button" onClick={handleUpdate}>Update</button>
          <button type="button" onClick={() => handleDeleteConfirmation(bluebook)}>Delete</button>
        </div>
      </form>
      {/* Confirmation message component */}
      {confirmationVisible && (
        <ConfirmationMessage
          message="Are you sure you want to delete this license?"
          onConfirm={handleDelete}
          onCancel={handleCancelDelete}
        />
      )}
      <p className="changeable-note">Note: Only Tax Paid and Valid Up To are changeable</p>
    </div>
  );
};

export default BluebookDetails;
