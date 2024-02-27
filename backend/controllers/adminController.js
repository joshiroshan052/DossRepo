const Users = require("../model/userModel");
const bcrypt = require("bcrypt");
const generateToken = require('../middleware/auth').generateToken;


// Admin Login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Please enter both email and password.",
    });
  }

  try {
    // Find the user by email
    const user = await Users.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "Admin not found.",
      });
    }

    // Check if the user is an admin
    if (user.is_admin !== 1) {
      return res.json({
        success: false,
        message: "Unauthorized access. Admin login required.",
      });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      token : token,
      message: "Admin login successful.",
    });
  } catch (error) {
    console.error("Error in admin login:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  console.log("Get all user data requests");

  try {
    const users = await Users.find();

    if (!users) {
      console.log("No users found");
      return res.json({
        success: false,
        message: "No user found",
      });
    } else {
      return res.json({
        success: true,
        message: "Users found",
        data: users,
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "Error occurred",
    });
  }
};

module.exports = {
  adminLogin,
  getAllUsers
};
