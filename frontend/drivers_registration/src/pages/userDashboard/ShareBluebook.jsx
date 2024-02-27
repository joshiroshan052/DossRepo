import React, { useState, useEffect } from 'react';
import { getAllBluebookApi, shareBluebookApi, getAllFollowingUsersApi } from '../../apis/Api';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

const ShareSection = () => {
    const [bluebooks, setBluebooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUserListModal, setShowUserListModal] = useState(false);
    const [selectedBluebookId, setSelectedBluebookId] = useState(null); // State to store selected bluebookId
    const [usersYouFollow, setFollowingUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null); // State to store selected userId

    useEffect(() => {
        fetchBluebooks();
        fetchUsersYouFollow();
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

    const fetchUsersYouFollow = async () => {
        try {
            const loggedInUserId = JSON.parse(localStorage.getItem('user'))._id;
            const response = await getAllFollowingUsersApi(loggedInUserId);
            setFollowingUsers(response.data.followedUsers);
        } catch (error) {
            console.error("Error fetching followed users:", error.message);
        }
    };

    const handleShareBluebook = (bluebookId, userId) => {
        setSelectedBluebookId(bluebookId); // Set the selected bluebookId
        setSelectedUserId(userId);
        setShowUserListModal(true);
        // Check if the bluebook is already shared with the user

    };

    const handleSendBluebook = async (userId) => {
        try {
            // Check if a bluebook has been selected
            if (!selectedBluebookId) {
                toast.error('Please select a bluebook to share');
                return;
            }
            // Call the shareBluebookApi function with userId first, followed by the object containing bluebookId and userId
            const response = await shareBluebookApi(userId, { bluebookId: selectedBluebookId, userId: selectedUserId });
            if (response.data.success) {
                toast.success('Bluebook shared successfully');
            } else {
                toast.error(response.data.message);
            }
            setShowUserListModal(false);
        } catch (error) {
            console.error('Error sharing bluebook:', error);
            toast.error('Error sharing bluebook');
        }
    }
    const userId = JSON.parse(localStorage.getItem('user'))._id;
    return (
        <div className="bluebook-container">
            <h2 className="bluebook-title">Bluebook Entries</h2>
            {loading ? (
                <p>Loading...</p>
            ) : bluebooks.length === 0 ? (
                <div className="no-bluebooks">
                    <p>No bluebook entries found.</p>
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
                                    <button onClick={() => handleShareBluebook(bluebook._id, userId)} className="share-bluebook-button">
                                        Share Bluebook
                                    </button>

                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {showUserListModal && (
                <div className="user-list-modal">
                    <h3>Users You Follow</h3>
                    <ul>
                        {usersYouFollow.map(user => (
                            <li key={user._id}>
                                {user.firstName} {user.lastName} - {user.email}
                                <button onClick={() => {
                                    handleSendBluebook(user._id);
                                    setSelectedBluebookId(user._id); // Set the selected bluebookId (same as userId for consistency)
                                }}>Send</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default ShareSection;