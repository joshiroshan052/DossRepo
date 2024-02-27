import React, { useState, useEffect } from 'react';
import { getSharedBluebooksApi } from '../../apis/Api';
import { ToastContainer, toast } from 'react-toastify';
import './ViewSharedBluebook.css';

const SharedBluebooks = () => {
    const [sharedBluebooks, setSharedBluebooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSharedBluebooks();
    }, []);

    const fetchSharedBluebooks = async () => {
        try {
            const loggedInUserId = JSON.parse(localStorage.getItem('user'))._id;
            const response = await getSharedBluebooksApi(loggedInUserId);
            setSharedBluebooks(response.data.sharedBluebooks);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching shared bluebooks:', error);
            toast.error('Error fetching shared bluebooks');
        }
    };

    return (
        <div className="shared-bluebooks-container">
            <h2>Shared Bluebooks</h2>
            {loading ? (
                <p>Loading...</p>
            ) : sharedBluebooks.length === 0 ? (
                <p>No shared bluebooks found.</p>
            ) : (
                <ul>
                    {sharedBluebooks.map((sharedBluebook, index) => (
                        <li key={index} className="shared-bluebook">
                            <div className="bluebook-detail">
                                <strong>Bluebook Name:</strong> {sharedBluebook.bluebook.bluebookName}
                            </div>
                            <div className="bluebook-detail">
                                <strong>Registration Authority:</strong> {sharedBluebook.bluebook.registrationAuthority}
                            </div>
                            <div className="bluebook-detail">
                                <strong>Vehicle Class:</strong> {sharedBluebook.bluebook.vehicleClass}
                            </div>
                            <div className="bluebook-detail">
                                <strong>Bluebook Status:</strong> {sharedBluebook.bluebook.bluebookStatus}
                            </div>
                            <div className="bluebook-detail">
                                <strong>Fuel Type:</strong> {sharedBluebook.bluebook.fuelType}
                            </div>
                            <div className="bluebook-detail">
                                <strong>Vehicle Manufactured Year:</strong> {sharedBluebook.bluebook.vehicleManufactured}
                            </div>
                            <div className="bluebook-detail">
                                <strong>Tax Paid:</strong> {sharedBluebook.bluebook.taxPaid}
                            </div>
                            <div className="bluebook-detail">
                                <strong>Valid Up To:</strong> {sharedBluebook.bluebook.validUpTo}
                            </div>
                            <div className="bluebook-detail">
                                <strong>Chassis Number:</strong> {sharedBluebook.bluebook.chassisNumber}
                            </div>
                            <div className="bluebook-detail">
                                <strong>Engine Number:</strong> {sharedBluebook.bluebook.engineNumber}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <ToastContainer />
        </div>
    );
};

export default SharedBluebooks;
