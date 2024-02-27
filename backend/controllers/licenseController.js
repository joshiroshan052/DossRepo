const cloudinary = require("cloudinary");
const License = require("../model/licenseModel");
const Users = require("../model/userModel");

const createLicense = async (req, res) => {
  const userId = req.user.userId;
  const { licenseName } = req.body;
  const image = req.files ? req.files.image : null;

  if (!licenseName || !image) {
    return res.json({
      success: false,
      message: "Please provide both license name and image.",
    });
  }

  try {
    const uploadedImage = await cloudinary.v2.uploader.upload(
      image.path,
      {
        folder: "license",
        crop: "scale",
      }
    );

    const newLicense = new License({
      licenseName: licenseName,
      image: uploadedImage.secure_url,
      createdBy: userId,
      licenseStatus: "Not Approved",
      approved : "false"
      
    });

    // Save the new license
    await newLicense.save();

    // Retrieve the newly created license ID
    const licenseId = newLicense._id;

    // Update the corresponding user's license field with the licenseId
    await Users.findByIdAndUpdate(userId, { $push: { license: licenseId } });

    res.json({
      success: true,
      message: "License added successfully",
      license: newLicense,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};
//get all license
const getAllLicense = async (req, res) => {
  try {
    const userId = req.params.id; // Retrieve the user ID from request parameters
    const allLicense = await License.find({ createdBy: userId }); //curly bracket error aaucha vanera (khali narakhna)
    res.json({
      success: true,
      message: "All license fetched successfully!",
      license: allLicense,
    });
  } catch (error) {
    console.log(error);
    res.send("Internal Server Error");
  }
};

//fetch single product
const getSingleLicense = async (req, res) => {
  const licenseId = req.params.id;
  try {
    const singleLicense = await License.findById(licenseId);
    res.json({
      success: true,
      message: "Single product fetched successfully!",
      product: singleLicense,
    });
  } catch (error) {
    console.log(error);
    res.send("Internal Server Error");
  }
};

//update product
const updateLicense = async (req, res) => {
  //step 1 : check incoming data
  console.log(req.body);
  console.log(req.files);
  //Step 2: Destructuring data(Json,file)
  const { licenseName, } =
    req.body;
  const { image } = req.files;
  //step 3: Validate data(Done valid image)
  if (
    !licenseName
  ){
    return res.json({
      success: false,
      message: "License Number is missing.!",
    });
  }
  //step 4: try catch block
  try {
    //if there is image
    if (image) {
      const uploadedImage = await cloudinary.v2.uploader.upload(
        productImage.path,
        {
          folder: "license",
          crop: "scale",
        }
      );

      //make updated json data
      const updatedData = {
        licenseName: licenseName,
        image: uploadedImage.secure_url,
      };
      //find product and update
      const licenseId = req.params.id;
      await License.findByIdAndUpdate(licenseId, updatedData);
      res.status(200).json({
        success: true,
        message: "License updated successfully with Image!",
        updateLicense: updatedData,
      });
    } else {
      const updatedData = {
        licenseName: licenseName,
      };
      //find product and update
      const licenseId = req.params.id;
      await License.findByIdAndUpdate(licenseId, updatedData);
      res.json({
        success: true,
        message: "License updated successfully without Image!",
        updateLicense: updatedData,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

//delete product
const deleteLicense = async (req, res) => {
  const licenseId = req.params.id;
  try {
    await License.findByIdAndDelete(licenseId);
    res.json({
      success: true,
      message: "License deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error!",
    });
  }
};
const getAllLicenses = async (req, res) => {
  try {
    const allLicense = await License.find({});
    res.json({
      success: true,
      message: "All license fetched successfully!",
      license: allLicense,
    });
  } catch (error) {
    console.error("Error fetching bluebook entries:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const updateLicenseStatus = async (req, res) => {
  try {
    const licenseId = req.params.id;
    const { licenseStatus } = req.body;

    console.log(licenseId);
    console.log(licenseStatus);

    // Check if the bluebook with the given ID exists
    const license = await License.findById(licenseId);
    if (!license) {
      return res.status(404).json({ success: false, message: 'License not found' });
    }

    // Update the bluebook status
    license.licenseStatus = licenseStatus;
    await license.save();

    return res.json({ success: true, message: 'License status updated successfully', license });
  } catch (error) {
    console.error('Error updating license status:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  createLicense,
  getAllLicense,
  getSingleLicense,
  updateLicense,
  deleteLicense,
  getAllLicenses,
  updateLicenseStatus
};