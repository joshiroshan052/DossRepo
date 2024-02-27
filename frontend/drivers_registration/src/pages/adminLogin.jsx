// AdminLogin.js

import React, { useEffect, useState } from "react";
import { loginAdmin } from "../apis/Api"; // Import your admin login API function
import { toast } from "react-toastify";
import "./login.css";
import Slider from "./Slider";
import { Link, useNavigate } from "react-router-dom";
import Icon2 from "../assets/images/loginpp.png";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem("token");
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const changeEmail = (e) => {
    setEmail(e.target.value);
  };

  const changePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      email: email,
      password: password,
    };

    loginAdmin(data)
      .then((res) => {
        if (res.data.success === true) {
          toast.success(res.data.message);
          localStorage.setItem("token", res.data.token);
          const convertedJson = JSON.stringify(res.data.useData);
          localStorage.setItem("user", convertedJson);
          navigate("/admin/dashboard");
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.message || "Error logging in.");
      });
  };

  return (
    <div className="background-img d-flex justify-content-center">
      <div className="bodys d-lg-flex d-md-flex d-sm-block mt-4 ">
        <div className="left-container p-4">
          <div className="change-image">
            <Slider />
          </div>
        </div>
        <div className="right-container  ">
          <div className="d-flex justify-content-center mt-5">
            <h2 className="pt-2 pb-2 text-center w-50 rounded-pill shadow-lg p-3 mb-5 bg-body rounded">Admin Login</h2>
          </div>
          <div className="d-flex justify-content-center">
            <img src={Icon2} alt="icon img" height="150" width="140" />
          </div>

          <input
            onChange={changeEmail}
            className="login-input form-control border-success mt-3"
            type="email"
            name="email"
            placeholder="Email"
            required=""
          />
          <div onChange={changePassword} className='pass'>
            <input
              className="login-input form-control border-success mt-3"
              name="pswd"
              type="password"
              placeholder="Password"
              required
            />
          </div>
          <hr className="solid" />
          <button onClick={handleSubmit} className="login-btn bg-dark">Log In</button>

          <h3 className="pt-9">
            Don't have an account?{" "}
            <span className="signup">
              {" "}
              <Link to="/register">Create Account</Link>
            </span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
