// shareController.js

const Bluebook = require("../model/bluebookModel");
const Users = require("../model/userModel");
const Share = require("../model/shareModel");

// Function to share a bluebook with a user
const shareBluebook = async (req, res) => {
  try {
    // Extract bluebook ID and user ID from request body
    const { bluebookId, userId } = req.body;

    // Log the user ID for debugging
    console.log("User ID:", userId);

    // Find the bluebook by ID
    const bluebook = await Bluebook.findById(bluebookId);
    if (!bluebook) {
      return res
        .status(404)
        .json({ success: false, message: "Bluebook not found" });
    }

    const existingShare = await Share.findOne({ bluebook: bluebookId });
    if (existingShare) {
      return res.status(500).json({ 
        success: false, 
        message: "Bluebook is already shared", 
      });
    }


    // Find the user by ID
    const user = await Users.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Share the bluebook with the user
    const share = new Share({
      bluebook: bluebookId,
      userId: userId,
      sharedBy: req.params.userId, 
    });
    await share.save();

    return res
      .status(200)
      .json({ success: true, message: "Bluebook shared successfully" });
  } catch (error) {
    console.error("Error sharing bluebook for user", ":", error); // Log the user ID with the error
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Function to fetch shared bluebooks for a user
const getSharedBluebooks = async (req, res) => {
  try {
    // Get the user ID from the request parameters
    const userId = req.params.userId;

    // Find all shared bluebooks for the user
    const sharedBluebooks = await Share.find({ sharedBy: userId }).populate(
      "bluebook"
    );

    return res.status(200).json({ success: true, sharedBluebooks });
  } catch (error) {
    console.error("Error fetching shared bluebooks:", error.message);
    return res.status(500)
      .json({ 
        success: false,
         message: error.message ,
        });
  }
};

module.exports = {
  shareBluebook,
  getSharedBluebooks,
};
