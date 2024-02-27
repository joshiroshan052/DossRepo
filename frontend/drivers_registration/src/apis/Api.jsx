// api.jsx

import axios from "axios";

const Api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
    headers: {
        "Content-Type" : "multipart/form-data"
    }
});

const config = {
  headers: {
      "authorization": `Bearer ${localStorage.getItem("token")}`,
  },
};

console.log(config)

export const registerApi = (data) => Api.post("/api/user/register", data);
export const loginApi = (data) => Api.post("/api/user/login", data);

export const forgotPasswordApi = (data) => Api.post("/api/user/forgot/password", data);
export const resetPasswordApi = (data, token) => Api.put(`/api/user/password/reset/${token}`, data);
export const updateUser = (userId, userData) => Api.put(`/api/user/update/${userId}`,userData)

// Add License APIs
export const createLicenseApi = (formData,licenseId) => Api.post(`/api/license/create_license/${licenseId}`,formData)
export const getAllLicenseApi = (licenseId) => Api.get(`/api/license/get_license/${licenseId}`)
export const getAllLicensesApi = () => Api.get('/api/license/getAllLicenses')
export const getSingleLicenseApi = (licenseId) => Api.post(`/api/license/getSingle_license/${licenseId}`, null, config);
export const updateLicenseApi = (licenseId, licenseData) => Api.put(`/api/license/update_license/${licenseId}`, licenseData, config);
export const deleteLicenseApi = (licenseId) => Api.delete(`/api/license/delete_license/${licenseId}`, config);
export const updateLicenseStatusApi = (licenseId, data) =>Api.put(`/api/license/updateStatus/${licenseId}`, data, config);


export const verifyEmail = (userId) => Api.get(`/verify?id=${userId}`);

export const getAllUserApi = () => Api.get('/api/admin/getAllUser');
export const loginAdmin = (data) => Api.post('/api/admin/adminLogin', data);

export const searchUserApi = (data) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  for (let key in data) {
    formData.append(key, data[key]);
  }
  return Api.post("/api/user/search", formData, {
    headers: {
      "authorization": `Bearer ${token}`,
    },
  });
};

export const followUserApi = (userId) => {
  return Api.get(`/api/user/follow/${userId}`,config);
};

export const getAllFollowedUsersApi = (userId) => Api.get(`/api/user/followedUsers/${userId}`, config);
export const getAllFollowingUsersApi = (userId) => Api.get(`/api/user/followingUsers/${userId}`, config);


export const createBluebookApi = (data) => Api.post('/api/bluebook/create_bluebook/', data);
export const getAllBluebooksApi = () => Api.get('/api/bluebook/getAllBluebook');
export const getSingleBluebookApi = (bluebookId) => Api.get(`/api/bluebook/get_bluebook/${bluebookId}`);
export const updateBluebookApi = (bluebookId, bluebookData) => Api.put(`/api/bluebook/update_bluebook/${bluebookId}`, bluebookData);
export const deleteBluebookApi = (bluebookId) => Api.delete(`/api/bluebook/delete_bluebook/${bluebookId}`);
export const updateBluebookStatusApi = (bluebookId, data) =>Api.put(`/api/bluebook/updateStatus/${bluebookId}`, data, config);
export const getAllBluebookApi = (userId) => Api.get(`/api/bluebook/getAll/${userId}`);

// Share bluebook API
export const shareBluebookApi = (userId, bluebookId) => Api.post(`/api/share/shareBluebook/${userId}`, bluebookId, config);

// Get shared bluebooks for a user API
export const getSharedBluebooksApi = (userId) => Api.get(`/api/share/shared/${userId}`, config);
