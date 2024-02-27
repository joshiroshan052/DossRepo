import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllUserApi } from '../apis/Api';

export const UserTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUserApi()
      .then((res) => {
        console.log(res.data);
        setUsers(res.data.data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-center">
          <h3 style={{ color: 'green', fontWeight: 'bolder' }}>Driver's Registration App</h3>
        </div>
        <div className="navbar-right">
          <Link className="btn btn-outline-primary me-2" to="/login">
            Login
          </Link>
          <Link className="btn btn-outline-success" to="/register">
            Register
          </Link>
        </div>
      </nav>
      <div className="m-4">
        <Link to="/admin/mainDashboard">
          <button type="button" className="btn btn-success butn" style={{ marginBottom: '3%' }}>
            Back
          </button>
        </Link>
        <h1 className="main-text" style={{ color: 'green', marginBottom: '3%' }}>User Details</h1>
        <table className="table mt-2">
          <thead className="table-success">
            <tr>
              <th>First Name</th>
              <th>Last Name </th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((userData) => (
              <tr key={userData._id.$oid}>
                <td>{userData.firstName}</td>
                <td>{userData.lastName}</td>
                <td>{userData.email}</td>
                <td>{userData.phoneNo}</td>
                <td>{userData.is_verified ? 'Verified' : 'Not Verified'}</td>
                <td>
                  <div className="btn-group" role="group">
                  <Link to={''} className="btn btn-success">Edit</Link>
                    <button onClick={''} className="btn btn-danger">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

