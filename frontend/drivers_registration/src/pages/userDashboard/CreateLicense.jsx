import React, { useState } from 'react';
import { createLicenseApi } from '../../apis/Api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CreateLicense.css'; // Import CSS file for styling

const CreateLicense = () => {
  const [licenseData, setLicenseData] = useState({
    licenseName: '',
    licenseImage: null,
    previewImage: null,
  });

  const loggedInUserId = JSON.parse(localStorage.getItem('user'))._id;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLicenseData({ ...licenseData, [name]: value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const preview = URL.createObjectURL(file);
    setLicenseData({ ...licenseData, licenseImage: file, previewImage: preview });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('licenseName', licenseData.licenseName);
      formData.append('licenseImage', licenseData.licenseImage);
      formData.append('userId', loggedInUserId);
      
      await createLicenseApi(formData);
      toast.success('License added successfully');
      setLicenseData({
        licenseName: '',
        licenseImage: null,
        previewImage: null,
      });
    } catch (error) {
      console.error('Error creating license:', error.message);
      toast.error('Error creating license. Please try again.');
    }
  };

  return (
    <div className="create-license-container">
      <h2>Create License</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="licenseName">License Name</label>
          <input type="text" id="licenseName" name="licenseName" value={licenseData.licenseName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="licenseImage">License Image</label>
          <input type="file" id="licenseImage" name="licenseImage" onChange={handleImageUpload} required />
          {licenseData.previewImage && <img src={licenseData.previewImage} alt="Preview" className="preview-image" />}
        </div>
        <div className="button-group">
          <button type="submit">Create License</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateLicense;
