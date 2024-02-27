import React, { useState, useEffect } from "react";
import "./Search.css";
import { searchUserApi, followUserApi, getAllFollowedUsersApi } from "../../apis/Api";
import { toast } from "react-toastify";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchMessage, setSearchMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [followedUsers, setFollowedUsers] = useState([]);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await searchUserApi({ phoneNo: searchTerm });
      const users = response.data.users;
      const loggedInUserId = JSON.parse(localStorage.getItem("user"))._id;
      const updatedUsers = users.map((user) => ({
        ...user,
        isFollowing:
          user._id !== loggedInUserId &&
          loggedInUserId &&
          user.followers.includes(loggedInUserId),
      }));
      setSearchResults(updatedUsers || []);
      setSearchMessage(updatedUsers && updatedUsers.length === 0 ? "User not found" : "");
    } catch (error) {
      console.error("Error searching users:", error.message);
      setSearchMessage("Error searching users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async (userId, isFollowing) => {
    try {
      await followUserApi(userId);
      setSearchResults((prevResults) =>
        prevResults.map((user) =>
          user._id === userId ? { ...user, isFollowing: !isFollowing } : user
        )
      );
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      updatedUser.following = isFollowing ? updatedUser.following.filter(id => id !== userId) : [...updatedUser.following, userId];
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success(isFollowing ? "Unfollowed successfully" : "Followed successfully");
      if (!isFollowing) {
        setFollowedUsers((prevFollowedUsers) => [...prevFollowedUsers, userId]);
      } else {
        setFollowedUsers((prevFollowedUsers) =>
          prevFollowedUsers.filter((id) => id !== userId)
        );
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error.message);
    }
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
    const performSearch = async () => {
      if (searchTerm.trim() === "") {
        setSearchMessage("Enter a number to find users");
        setSearchResults([]);
      } else {
        await handleSearch();
      }
    };

    performSearch();
  }, [searchTerm]);

  const loggedInUserId = JSON.parse(localStorage.getItem("user"))._id;

  return (
    <div className="search-container text-light">
      <h3 className="search-title">Search</h3>
      <div className="search-content">
        <div className="search-results">
          <div className="search-input">
            <div className="input-group mt-3">
              <span className="input-group-text" id="basic-addon1">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="basic-addon1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-primary" type="button" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
          <div className="search-result mt-3">
            {searchResults.length === 0 && searchMessage && (
              <div className="text-center text-danger">{searchMessage}</div>
            )}
            {searchResults.map((user) => (
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
                <div className="follow-button">
                  {user._id === loggedInUserId ? (
                    <button className="follows btn px-4" disabled>
                      View Profile
                    </button>
                  ) : (
                    <button
                      className={`follows btn px-4 ${user.isFollowing ? "unfollow" : "follow"}`}
                      onClick={() => handleFollow(user._id, user.isFollowing)}
                    >
                      {user.isFollowing ? "Unfollow" : "Follow"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="followed-users followed-users-border">
          <h3>Users You Follow</h3>
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
                {/* Add any additional details you want to display */}
              </div>
            ))
          ) : (
            <p>No users followed</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;

function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
