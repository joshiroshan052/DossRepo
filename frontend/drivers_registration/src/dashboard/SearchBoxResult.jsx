import React from "react";

const SearchResultBox = ({ user, onFollow }) => {
  return (
    <div className="search-result-box">
      <h3>{user.firstName} {user.lastName}</h3>
      <p>Email: {user.email}</p>
      <p>Phone Number: {user.phoneNo}</p>
      <button onClick={() => onFollow(user._id)}>Follow</button>
    </div>
  );
};

export default SearchResultBox;
