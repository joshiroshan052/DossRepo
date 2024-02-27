// CreateBluebook.jsx

import React, { useState } from 'react';
import { createBluebookApi } from '../../apis/Api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CreateBluebook.css'; // Import CSS file for styling

const CreateBluebook = () => {
  const [bluebookData, setBluebookData] = useState({
    bluebookName: '',
    registrationAuthority: '',
    vehicleClass: '',
    fuelType: '',
    vehicleAge: '',
    vehicleManufactured: '',
    taxPaid: '',
    validUpTo: '',
    vehicleNumber: '',
    chassisNumber: '',
    engineNumber: ''
  });

  const loggedInUserId = JSON.parse(localStorage.getItem('user'))._id;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Format date values to yyyy-mm-dd
    if (name === 'taxPaid' || name === 'validUpTo') {
      const date = new Date(value);
      newValue = date.toISOString().split('T')[0]; // Format: yyyy-mm-dd
    }

    let newBluebookData = { ...bluebookData, [name]: newValue };

    // Calculate vehicle age when manufacturing year changes
    if (name === 'vehicleManufactured') {
      const currentYear = new Date().getFullYear();
      const age = currentYear - parseInt(value);
      newBluebookData = { ...newBluebookData, vehicleAge: age };
    }
    setBluebookData(newBluebookData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bluebookDataWithUserId = { ...bluebookData, userId: loggedInUserId };
      await createBluebookApi(bluebookDataWithUserId);
      toast.success('Bluebook entry created successfully');
      setBluebookData({
        bluebookName: '',
        registrationAuthority: '',
        vehicleClass: '',
        fuelType: '',
        vehicleAge: '',
        vehicleManufactured: '',
        taxPaid: '',
        validUpTo: '',
        vehicleNumber: '',
        chassisNumber: '',
        engineNumber: ''
      });
    } catch (error) {
      console.error('Error creating bluebook entry:', error.message);
      toast.error('Error creating bluebook entry. Please try again.');
    }
  };
  

  return (
    <div className="create-bluebook-container">
      <h2>Create Bluebook Entry</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group-bluebook">
          <label htmlFor="bluebookName">Owner Name</label>
          <input type="text" id="bluebookName" name="bluebookName" value={bluebookData.bluebookName} onChange={handleChange} required />
        </div>
        <div className="form-group-bluebook">
          <label htmlFor="vehicleNumber">Vehicle Number</label>
          <input type="text" id="vehicleNumber" name="vehicleNumber" value={bluebookData.vehicleNumber} onChange={handleChange} required />
        </div>
        <div className="form-group-bluebook">
          <label htmlFor="registrationAuthority">Registration Authority</label>
          <select id="registrationAuthority" name="registrationAuthority" value={bluebookData.registrationAuthority} onChange={handleChange} required>
            <option value="">Select Registration Authority</option>
            <option value="State 1">State 1</option>
            <option value="State 2">State 2</option>
            <option value="State 3">State 3</option>
            <option value="State 4">State 4</option>
            <option value="State 5">State 5</option>
            <option value="State 6">State 6</option>
            <option value="State 7">State 7</option>
          </select>
        </div>
        <div className="form-group-bluebook">
          <label htmlFor="vehicleClass">Vehicle Class (CC)</label>
          <input type="text" id="vehicleClass" name="vehicleClass" value={bluebookData.vehicleClass} onChange={handleChange} required />
        </div>
        <div className="form-group-bluebook">
          <label htmlFor="fuelType">Fuel Type</label>
          <select id="fuelType" name="fuelType" value={bluebookData.fuelType} onChange={handleChange} required>
            <option value="">Select Fuel Type</option>
            <option value="diesel">Diesel</option>
            <option value="petrol">Petrol</option>
            <option value="electric">Electric</option>
          </select>
        </div>
        <div className="form-group-bluebook">
          <label htmlFor="vehicleManufactured">Vehicle Manufactured Year</label>
          <input type="number" id="vehicleManufactured" name="vehicleManufactured" value={bluebookData.vehicleManufactured} onChange={handleChange} min="1900" max="2024" required />
        </div>
        <div className="form-group-bluebook">
          <label htmlFor="vehicleAge">Vehicle Age (Years)</label>
          <input type="number" id="vehicleAge" name="vehicleAge" value={bluebookData.vehicleAge} onChange={handleChange} readOnly />
        </div>
        <div className="form-group-bluebook">
          <label htmlFor="taxPaid">Tax Paid</label>
          <input type="date" id="taxPaid" name="taxPaid" value={bluebookData.taxPaid} onChange={handleChange} required />
        </div>
        <div className="form-group-bluebook">
          <label htmlFor="validUpTo">Valid Up To</label>
          <input type="date" id="validUpTo" name="validUpTo" value={bluebookData.validUpTo} onChange={handleChange} required />
        </div>
        <div className="form-group-bluebook">
          <label htmlFor="chassisNumber">Chassis Number</label>
          <input type="text" id="chassisNumber" name="chassisNumber" value={bluebookData.chassisNumber} onChange={handleChange} required />
        </div>
        <div className="form-group-bluebook">
          <label htmlFor="engineNumber">Engine Number</label>
          <input type="text" id="engineNumber" name="engineNumber" value={bluebookData.engineNumber} onChange={handleChange} required />
        </div>
        <div className="button-group-bluebook">
          <button type="submit">Create Bluebook</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateBluebook;
