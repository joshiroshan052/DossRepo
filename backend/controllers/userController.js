const { sendEmail } = require("../middleware/sendMail");
const Users = require("../model/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const generateToken = require("../middleware/auth").generateToken;
const Activity = require("../model/followModel");
const { error } = require("console");

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

const sendVerifyMail = async (firstName, email, user_id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "joshiroshan051@gmail.com",
        pass: "ohmu hnfz btgy isci",
      },
    });
    const mailOptions = {
      from: "joshiroshan051@gmail.com",
      to: email,
      subject: "For Verification mail",
      html: `<p>Hi, ${firstName} ,Please click here to <a href= "http://localhost:5000/api/user/verify/${user_id}"> Verify </a> your mail.</p>`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been successfully sent:-", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const createUser = async (req, res) => {
  try {
    console.log(req.body);
    const { firstName, lastName, email, phoneNo, password } = req.body;
    if (!firstName || !lastName || !email || !phoneNo || !password) {
      return res.json({
        success: false,
        message: "Please enter all fields.",
      });
    }
    let user = await Users.findOne({ email });
    if (user) {
      return res.json({ success: false, message: "User already exists" });
    }
    const spassword = await securePassword(req.body.password);

    // Create a new user
    user = new Users({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNo: req.body.phoneNo,
      password: spassword,
      is_admin: 0,
    });

    // Save the user to the database
    const userData = await user.save();

    // Send verification mail
    sendVerifyMail(firstName, email, userData._id);

    // Return success response
    res.status(200).json({
      success: true,
      message: "User Created Successfully. Please verify your email.",
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const verifyMail = async (req, res) => {
  try {
    console.log("Verify Mail Request Params:", req.params); // Check the request parameters
    const updateInfo = await Users.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: { is_verified: 1 },
      }
    );
    console.log("Update Info:", updateInfo); // Check the update info
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Verify Mail Error:", error); // Check the error message
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Please enter all fields.",
    });
  }

  try {
    const user = await Users.findOne({ email: email });

    if (!user) {
      return res.json({
        success: false,
        message: "User doesn't exist.",
      });
    }

    if (user.is_verified === 0) {
      return res.status(500).json({
        success: false,
        message: "Please verify your email first.",
      });
    }

    const databasePass = user.password;
    const isMatch = await bcrypt.compare(password, databasePass);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid Credentials.",
      });
    }

    // Generate a token for the user
    const token = generateToken(user._id);

    console.log("User LoggedIn Successfully:", user);

    res.status(200).json({
      success: true,
      message: "User LoggedIn Successfully.",
      token: token,
      useData: user,
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


const forgotPassword = async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email });

    if (!user) {
      return res.json({
        success: false,
        message: "Email not found.",
      });
    }
    if (user.is_verified === 0) {
      return res.json({
        success: false,
        message: "Please verify your email first.",
      });
    }
    const resetPasswordToken = user.getResetPasswordToken();

    await user.save();

    // Assuming you have a configuration variable for the frontend URL
    const frontendBaseUrl =
      process.env.FRONTEND_BASE_URL || "http://localhost:3000";
    const resetUrl = `${frontendBaseUrl}/password/reset/${resetPasswordToken}`;

    const message = `Reset Your Password by clicking on the link below: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Reset Password",
        message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email}`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await Users.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid or has expired",
      });
    }

    const newPassword = await securePassword(req.body.password);
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password Updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const searchUserByPhoneNo = async (req, res) => {
  try {
    const { phoneNo } = req.body;
    const users = await Users.find({
      phoneNo: { $regex: phoneNo },
    }).select("-password");
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const followUser = async (req, res) => {
  try {
    console.log("req.params", req.params);
    const userToFollow = await Users.findById(req.params.id);
    console.log("req.user", req.user);
    const loggedInUser = await Users.findById(req.user.userId);

    console.log("loggedIn user", loggedInUser);
    console.log("UserToFollow", userToFollow);

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the user is trying to follow themselves
    if (loggedInUser._id.equals(userToFollow._id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    if (loggedInUser.following.includes(userToFollow._id)) {
      // If already following, unfollow
      const indexFollowing = loggedInUser.following.indexOf(userToFollow._id);
      const indexFollowers = userToFollow.followers.indexOf(loggedInUser._id);

      loggedInUser.following.splice(indexFollowing, 1);
      userToFollow.followers.splice(indexFollowers, 1);

      await loggedInUser.save();
      await userToFollow.save();
      

      res.status(200).json({
        success: true,
        message: "User Unfollowed",
      });
    } else {
      // If not following, follow
      loggedInUser.following.push(userToFollow._id);
      userToFollow.followers.push(loggedInUser._id);

      await loggedInUser.save();
      await userToFollow.save();

      res.status(200).json({
        success: true,
        message: "User followed",
      });
    }
  } catch (error) {
    console.error("Error in followUser:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message, 
    });
  }
};
const getFollowedUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user.userId; // Assuming you have the user ID in the request object
    const requestedUserId = req.params.userId; // Extract userId from the request parameters

    // Check if the requested userId matches the logged-in user's ID
    if (loggedInUserId !== requestedUserId) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    const loggedInUser = await Users.findById(loggedInUserId).populate("following", "-password"); // Assuming you have a 'following' field in your user schema

    if (!loggedInUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Extract the followed users from the loggedInUser object
    const followedUsers = loggedInUser.following.map(user => ({
      avatar: user.avatar,
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      // Add other fields you want to include
    }));

    res.status(200).json({ success: true, followedUsers });
  } catch (error) {
    console.error("Error in getFollowedUsers:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
const getFollowingUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user.userId; // Assuming you have the user ID in the request object
    const requestedUserId = req.params.userId; // Extract userId from the request parameters

    // Check if the requested userId matches the logged-in user's ID
    if (loggedInUserId !== requestedUserId) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    const loggedInUser = await Users.findById(loggedInUserId).populate("followers", "-password"); // Assuming you have a 'followers' field in your user schema

    if (!loggedInUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Extract the followed users from the loggedInUser object
    const followedUsers = loggedInUser.followers.map(user => ({
      avatar: user.avatar,
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      // Add other fields you want to include
    }));

    res.status(200).json({ success: true, followedUsers });
  } catch (error) {
    console.error("Error in getFollowedUsers:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    let avatarUrl = null;
    if (req.files && req.files.avatar) {
      // If avatar file is uploaded
      const { avatar } = req.files;
      const uploadedAvatar = await cloudinary.uploader.upload(avatar.path, { folder: 'avatars' });
      if (!uploadedAvatar || !uploadedAvatar.secure_url) {
        return res.status(500).json({
          success: false,
          message: 'Failed to upload avatar to Cloudinary',
        });
      }
      avatarUrl = uploadedAvatar.secure_url;
    } else if (typeof req.body.avatar === 'string') {
      // If avatar URL is provided in the request body
      avatarUrl = req.body.avatar;
    }

    // Update user profile with new data
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.phoneNo = req.body.phoneNo || user.phoneNo;
    user.avatar = avatarUrl || user.avatar;

    // Save the updated user profile
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User profile updated successfully.',
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};




module.exports = {
  createUser, 
  loginUser,
  verifyMail,
  forgotPassword,
  resetPassword,
  searchUserByPhoneNo,
  followUser,
  getFollowedUsers,
  getFollowingUsers,
  updateUserProfile
};
