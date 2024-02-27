// shareModel.js

const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bluebook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bluebook',
    required: true,
  },
  sharedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true, 
  },
  sharedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Share', shareSchema);
