import React, { useState, useEffect } from 'react';
import { getAllBluebooksApi, updateBluebookStatusApi, deleteBluebookApi } from "../apis/Api";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import "./AdminPanel.css";

const AdminPanel = () => {
  const [bluebooks, setBluebooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllBluebooks();
  }, []);

  const fetchAllBluebooks = async () => {
    try {
      const response = await getAllBluebooksApi();
      setBluebooks(response.data.bluebooks);
    } catch (error) {
      console.error('Error fetching bluebooks:', error);
      toast.error('Error fetching bluebooks');
    }
  };

  const handleUpdateStatus = async (bluebookId, newStatus) => {
    try {
      const response = await updateBluebookStatusApi(bluebookId, { bluebookStatus: newStatus });
      console.log(response.data); // Log the response data to check if it's successful
      setBluebooks(prevBluebooks =>
        prevBluebooks.map(bluebook =>
          bluebook._id === bluebookId ? { ...bluebook, bluebookStatus: newStatus } : bluebook
        )
      );
      toast.success('Bluebook status updated successfully');
    } catch (error) {
      console.error('Error updating bluebook status:', error);
      toast.error('Error updating bluebook status');
    }
  };

  const handleDeleteBluebook = async (bluebookId) => {
    try {
      await deleteBluebookApi(bluebookId);
      setBluebooks(prevBluebooks => prevBluebooks.filter(bluebook => bluebook._id !== bluebookId));
      toast.success('Bluebook deleted successfully');
    } catch (error) {
      console.error('Error deleting bluebook:', error);
      toast.error('Error deleting bluebook');
    }
  };

  const handleViewDetails = (bluebookId) => {
    navigate(`/admin/bluebook/viewDetails/${bluebookId}`);
  };

  return (
    <div className="admin-panel">
      <h2>All Bluebooks</h2>
      <div className="bluebook-list">
        {bluebooks.map(bluebook => (
          <div key={bluebook._id} className="bluebook-card">
            <h3>{bluebook.bluebookName}</h3>
            <p>Vehicle Number: {bluebook.vehicleNumber}</p>
            <p>Status: {bluebook.bluebookStatus}</p>
            <p>Created By: {bluebook.createdBy ? `${bluebook.createdBy.firstName} ${bluebook.createdBy.lastName}` : 'Unknown'}</p>
            <div className="button-container">
              <button className="approve-button" onClick={() => handleUpdateStatus(bluebook._id, "Approved")}>Approve</button>
              <button className="reject-button" onClick={() => handleUpdateStatus(bluebook._id, "Not Approved")}>Reject</button>
              <button className="view-details-button" onClick={() => handleViewDetails(bluebook._id)}>View Details</button>
              <button className="delete-button" onClick={() => handleDeleteBluebook(bluebook._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
