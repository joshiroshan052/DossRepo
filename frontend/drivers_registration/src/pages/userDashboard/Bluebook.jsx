// Bluebook.js

import React, { useState, useEffect } from 'react';
import { getAllBluebookApi, deleteBluebookApi } from '../../apis/Api';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Bluebook.css';

const Bluebook = () => {
  const [bluebooks, setBluebooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBluebooks();
  }, []);

  const fetchBluebooks = async () => {
    try {
      const loggedInUserId = JSON.parse(localStorage.getItem('user'))._id;
      const response = await getAllBluebookApi(loggedInUserId);
      setBluebooks(response.data.bluebooks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bluebooks:', error);
      toast.error('Error fetching bluebooks');
    }
  };

  const handleDelete = async (bluebookId) => {
    try {
      await deleteBluebookApi(bluebookId);
      setBluebooks(bluebooks.filter(bluebook => bluebook._id !== bluebookId));
      toast.success('Bluebook entry deleted successfully');
    } catch (error) {
      console.error('Error deleting bluebook entry:', error);
      toast.error('Error deleting bluebook entry');
    }
  };

  return (
    <div className="bluebook-container">
      <h2 className="bluebook-title">Bluebook Entries</h2>
      {loading ? (
        <p>Loading...</p>
      ) : bluebooks.length === 0 ? (
        <div className="no-bluebooks">
          <p>No bluebook entries found.</p>
          <Link to="/bluebook/create" className="create-bluebook-link">
            Create Bluebook
          </Link>
        </div>
      ) : (
        <div>
          {bluebooks.map(bluebook => (
            <div key={bluebook._id} className="bluebook-card">
              <h3 className="bluebook-name">{bluebook.bluebookName}</h3>
              <p className="bluebook-info">Vehicle Number: {bluebook.vehicleNumber}</p>
              <p className="bluebook-info">Status: {bluebook.bluebookStatus}</p>
              <p className="bluebook-info">Chassis Number: {bluebook.chassisNumber}</p>
              <p className="bluebook-info">Engine Number: {bluebook.engineNumber}</p>
              {bluebook.bluebookStatus === "Not Approved" && (
                <div>
                  <p className="admin-approval-message">Waiting for admin approval</p>
                  <button disabled className="view-details-button">View Details</button>
                </div>
              )}
              {bluebook.bluebookStatus === "Approved" && (
                <div>
                  <Link to={`/bluebook/viewDetails/${bluebook._id}`} className="view-details-link">
                    View Details
                  </Link>
                </div>
              )}
            </div>
          ))}
          <Link to="/bluebook/create" className="create-bluebook-link">
            Create Bluebook
          </Link>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Bluebook;
