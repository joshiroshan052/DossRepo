const Bluebook = require("../model/bluebookModel");
const Users = require("../model/userModel");


// Create a new bluebook entry
const createBluebook = async (req, res) => {
  const userId = req.user.userId;
  console.log(userId);
  try {
    const {
      bluebookName,
      registrationAuthority,
      vehicleClass,
      fuelType,
      vehicleManufactured, // Updated field name
      vehicleNumber,
      taxPaid,
      validUpTo,
      chassisNumber,
      engineNumber,
    } = req.body;

    // Calculate vehicle age
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - vehicleManufactured;

    const newBluebook = new Bluebook({
      vehicleNumber,
      bluebookName,
      registrationAuthority,
      vehicleClass,
      fuelType,
      vehicleManufactured,
      vehicleAge,
      taxPaid,
      validUpTo,
      chassisNumber,
      engineNumber,
      createdByBluebook: userId
    });

    await newBluebook.save();

    const bluebookId = newBluebook._id;
    await Users.findByIdAndUpdate(userId, {$push: { bluebook: bluebookId}});

    res.json({
      success: true,
      message: "Bluebook entry created successfully",
      bluebook: newBluebook,
    });
  } catch (error) {
    console.error("Error creating bluebook entry:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get all bluebook entries
const getAllBluebook = async (req, res) => {
  try {
    const userId = req.params.id; // Retrieve the user ID from request parameters
    const allBluebooks = await Bluebook.find({ createdByBluebook: userId });
    res.json({
      success: true,
      message: "All bluebook entries fetched successfully!",
      bluebooks: allBluebooks,
    });
  } catch (error) {
    console.error("Error fetching bluebook entries:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// Update a bluebook entry by ID
const updateBluebook = async (req, res) => {
  const bluebookId = req.params.id;
  try {
    const {
      vehicleManufactured,
      taxPaid,
      validUpTo,
    } = req.body;

    // Calculate vehicle age
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - vehicleManufactured;

    const updatedBluebook = await Bluebook.findByIdAndUpdate(
      bluebookId,
      {
        ...req.body,
        vehicleAge, // Update vehicle age
      },
      { new: true }
    );
    res.json({
      success: true,
      message: "Bluebook entry updated successfully!",
      bluebook: updatedBluebook,
    });
  } catch (error) {
    console.error("Error updating bluebook entry:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Delete a bluebook entry by ID
const deleteBluebook = async (req, res) => {
  const bluebookId = req.params.id;
  try {
    await Bluebook.findByIdAndDelete(bluebookId);
    res.json({
      success: true,
      message: "Bluebook entry deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting bluebook entry:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


const getAllBluebooks = async (req, res) => {
  try {
    const allBluebooks = await Bluebook.find({}).populate('createdByBluebook', 'firstName lastName'); // Populate the createdBy field
    res.json({
      success: true,
      message: "All bluebook entries fetched successfully!",
      bluebooks: allBluebooks,
    });
  } catch (error) {
    console.error("Error fetching bluebook entries:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getSingleBluebook = async (req, res) => {
  const bluebookId = req.params.id;
  try {
    const bluebook = await Bluebook.findById(bluebookId);
    if (!bluebook) {
      return res.status(404).json({
        success: false,
        message: "Bluebook entry not found",
      });
    }
    if (bluebook.bluebookStatus !== 'Approved') {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view this bluebook entry.",
      });
    }
    res.json({
      success: true,
      message: "Bluebook entry fetched successfully!",
      bluebook: bluebook,
    });
  } catch (error) {
    console.error("Error fetching single bluebook entry:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// Update the status of a bluebook entry by ID
const updateBluebookStatus = async (req, res) => {
  try {
    const bluebookId = req.params.id;
    const { bluebookStatus } = req.body;

    console.log(bluebookId);
    console.log(bluebookStatus);

    // Check if the bluebook with the given ID exists
    const bluebook = await Bluebook.findById(bluebookId);
    if (!bluebook) {
      return res.status(404).json({ success: false, message: 'Bluebook not found' });
    }

    // Update the bluebook status
    bluebook.bluebookStatus = bluebookStatus;
    await bluebook.save();

    return res.json({ success: true, message: 'Bluebook status updated successfully', bluebook });
  } catch (error) {
    console.error('Error updating bluebook status:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


module.exports = {
  createBluebook,
  getAllBluebook,
  getSingleBluebook,
  updateBluebook,
  deleteBluebook,
  getAllBluebooks,
  updateBluebookStatus
};
