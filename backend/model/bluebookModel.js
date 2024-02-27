// bluebookModel.js

const mongoose = require("mongoose");

const bluebookSchema = new mongoose.Schema({
    bluebookName: {
        type: String,
        required: true,
        trim: true,
    },
    registrationAuthority: {
        type: String,
        required: true,
        trim: true,
        enum: ["State 1", "State 2", "State 3","State 4", "State 5", "State 6","State 7"],
    },
    vehicleClass: {
        type: String,
        required: true,
        trim: true,
    },
    bluebookStatus: {
        type: String,
        required: true,
        default: "Not Approved", // Or whatever default value you prefer
        trim: true,
    },
    fuelType: {
        type: String,
        required: true,
        trim: true,
        enum: ["diesel", "petrol", "electric"],
    },
    vehicleManufactured: {
        type: Number,
        required: true,
    },
    vehicleAge: {
        type: Number,
        required: true,
    },
    taxPaid: {
        type: Date,
        required: true,
    },
    validUpTo: {
        type: Date,
        required: true,
    },
    vehicleNumber: {
        type: String,
        required: true,
    },
    chassisNumber: {
        type: String,
        required: true,
    },
    engineNumber: {
        type: String,
        required: true,
    },
    createdByBluebook: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference the User model
        required: true
    }, 
    approvedBluebook: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Bluebook", bluebookSchema);
