const mongoose = require('mongoose');

const licenseSchema = new mongoose.Schema({
    licenseName: {
        type: String,
        required : true,
        trim : true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference the User model
        required: true
    }, 
    image : {
        type : String,
        required : true,
    },
    createdAt : {
        type : Date,
        default : Date.now(),
    },
    approved: {
        type: Boolean,
        default: false
    },
    licenseStatus: {
        type: String,
        required: true,
        default: "Not Approved", // Or whatever default value you prefer
        trim: true,
    },

})
module.exports = mongoose.model('license', licenseSchema);
