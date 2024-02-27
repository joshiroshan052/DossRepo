import React, { useState, useEffect } from 'react';
import Bluebook from '../pages/userDashboard/Bluebook';
import License from '../pages/userDashboard/License';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { getAllFollowedUsersApi, getAllFollowingUsersApi, getSharedBluebooksApi } from "../apis/Api";
import './MainDashboard.css';


const Dashboard = () => {
  const [sharedBluebooks, setSharedBluebooks] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    fetchSharedBluebooks();
    setUserInfo();
  }, []);

  const fetchSharedBluebooks = async () => {
    try {
      const loggedInUserId = JSON.parse(localStorage.getItem('user'))._id;
      const response = await getSharedBluebooksApi(loggedInUserId);
      setSharedBluebooks(response.data.sharedBluebooks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching shared bluebooks:', error);
    }
  };

  const setUserInfo = () => {
    if (user) {
      setUserName(`${user.firstName} ${user.lastName}`);
    }

    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString(undefined, options);
    setGreeting(`Today is ${formattedDate}`);
  };

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      try {
        const loggedInUserId = JSON.parse(localStorage.getItem('user'))._id;
        const response = await getAllFollowedUsersApi(loggedInUserId);
        setFollowedUsers(response.data.followedUsers);
      } catch (error) {
        console.error("Error fetching followed users:", error.message);
      }
    };

    fetchFollowedUsers();
  }, []);

  useEffect(() => {
    const fetchFollowingUsers = async () => {
      try {
        const loggedInUserId = JSON.parse(localStorage.getItem('user'))._id;
        const response = await getAllFollowingUsersApi(loggedInUserId);
        setFollowingUsers(response.data.followedUsers);
      } catch (error) {
        console.error("Error fetching followed users:", error.message);
      }
    };

    fetchFollowingUsers();
  }, []);

  useEffect(() => {
    // Fetch user's name from local storage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUserName(storedUser.firstName); // Assuming the first name is stored
    }

    // Set the greeting
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString(undefined, options);
    setGreeting(`Today is ${formattedDate}`);
  }, []);

  return (
    <div className="dashboard-container">
      <div className="greeting-section">
        <div className="greeting">{greeting}</div>
        <div className="username">Welcome Back, {userName}</div>
        <div className="user-details">
          <img src={user.avatar} alt="User Avatar" className="avatar" />
          <div className="name-email-phone">
            <p className="user-name">{`${user.firstName} ${user.lastName}`}</p>
            <p className="user-email">{user.email}</p>
            <p className="user-phone">{user.phoneNo}</p>
          </div>
        </div>
        <div className="card-section">
          <h2>Bluebook</h2>
          <Link to={'/bluebook/create'} class="view-all-button">Create Bluebook </Link>
        </div>
        <div className="card-section2">
          <h2>License</h2>
          <Link to={'/license'} class="view-all-button">Create License </Link>
        </div>
        <div className="card-section3">
          <h2>Search Profile</h2>
          <Link to={'/search'} class="view-all-button">Search Users </Link>
        </div>
      </div>
      <div className="content">
        <div className="main-content">
          <div className="bluebook-section">
            <Bluebook />
          </div>
          <div className="license-section">
            <License />
          </div>
        </div>
        <div className="side-content">
          <div className="user-profile-section">
            <h3 tex>Follow</h3>
            {followedUsers && followedUsers.length > 0 ? (
              followedUsers.map((user) => (
                <div key={user._id} className="search-result-item">
                  <div className="search-result-img">
                    {user.avatar && isValidURL(user.avatar) ? (
                      <img src={user.avatar} alt="User Avatar" className="avatar-img" />
                    ) : (
                      <div className="avatar-placeholder">
                        <p className="fw-bold">{user.firstName}</p>
                      </div>
                    )}
                  </div>
                  <div className="search-result-details">
                    <h5>{user.firstName}</h5>
                    <h5>{user.lastName}</h5>
                    <p>{user.email}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No users followed</p>
            )}
          </div>
          <div className="user-profile-section2">
            <h3>Following</h3>
            {followingUsers && followingUsers.length > 0 ? (
              followingUsers.map((user) => (
                <div key={user._id} className="search-result-item">
                  <div className="search-result-img">
                    {user.avatar && isValidURL(user.avatar) ? (
                      <img src={user.avatar} alt="User Avatar" className="avatar-img" />
                    ) : (
                      <div className="avatar-placeholder">
                        <p className="fw-bold">{user.firstName}</p>
                      </div>
                    )}
                  </div>
                  <div className="search-result-details">
                    <h5>{user.firstName}</h5>
                    <h5>{user.lastName}</h5>
                    <p>{user.email}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No users followed</p>
            )}
          </div>
          {sharedBluebooks.length > 0 && (
            <div className="user-profile-section3">
              <h2>Shared Bluebook</h2>
              <ul>
                <li className="shared-bluebook">
                  <div className="bluebook-detail">
                    <strong>Bluebook Name:</strong> {sharedBluebooks[0].bluebook.bluebookName}
                  </div>
                  <div className="bluebook-detail">
                    <Link to={'/bluebook/sharedBluebook'} className="view-more-link">Share Bluebook</Link>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
