import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';
import dummyPhoto from '../assets/images/user.png';
import { updateUser } from '../apis/Api';
import { toast } from 'react-toastify';

const Profile = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNo: user.phoneNo,
    avatar: user.avatar,
  });

  const handleSubmit = async () => {
    try {
      const response = await updateUser(user._id, formData);
      console.log('Profile updated successfully:', response.data);
      toast.success('Profile updated successfully');
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
    } catch (error) {
      console.error('Error updating profile:', error.message);
      toast.error('Error updating profile');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = async (e) => {
    try {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData({
          ...formData,
          avatar: reader.result,
        });
      };
    } catch (error) {
      console.error('Error updating user profile:', error.message);
      toast.error('Error updating profile');
    }
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
  }, []);

  return (
    <div className="container">
      <h1>Profile</h1>
      <form>
        <div className="form-group">
          <label htmlFor="avatarInput">Profile Picture:</label>
          <input
            id="avatarInput"
            type="file"
            onChange={handlePhotoChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <label htmlFor="avatarInput" className="profile-photo">
            <img
              src={formData.avatar || user.avatar || dummyPhoto}
              alt="Profile"
              className="profile-photo-image"
            />
          </label>
        </div>
        <div className="form-row">
      <div className="form-group">
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
        />
      </div>
    </div>
    <div className="form-row">
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          disabled
        />
      </div>
      <div className="form-group">
        <label htmlFor="phoneNo">Phone Number:</label>
        <input
          type="tel"
          id="phoneNo"
          name="phoneNo"
          value={formData.phoneNo}
          onChange={handleInputChange}
        />
      </div>
    </div>
        <button type="button" onClick={handleSubmit}>Save Changes</button>
      </form>
    </div>
  );
};

export default Profile;
