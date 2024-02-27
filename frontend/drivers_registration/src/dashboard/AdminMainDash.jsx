import React from 'react';
import { Link } from 'react-router-dom';
import './AdminMainDash.css'; // Import the CSS file

const AdminMainDash = () => {
  return (
    <div className="admin-dash-container">
      <h2>Welcome to Admin Dashboard</h2>
      <div className="admin-dash-section blue">
        <h3>Manage Bluebooks</h3>
        <p>Click <Link to="/admin/dashboard">here</Link> to manage bluebooks.</p>
      </div>
      <div className="admin-dash-section green">
        <h3>Manage Users</h3>
        <p>Click <Link to="/admin/Userdashboard">here</Link> to manage users.</p>
      </div>
      <div className="admin-dash-section orange">
        <h3>Manage License</h3>
        <p>Click <Link to="/admin/license">here</Link> to manage licenses.</p>
      </div>
    </div>
  );
};

export default AdminMainDash;
