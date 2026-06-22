const mongoose = require("mongoose");

const contributionSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },

  backerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  amount: {
    type: Number,
    required: true,
    min: 1
  },

  rewardId: {
    type: String,
    default: null
  },

  paymentMethod: {
    type: String,
    enum: [
      "simulated_card",
      "easypaisa",
      "jazzcash"
    ],
    required: true
  },

  paymentStatus: {
    type: String,
    enum: [
      "completed",
      "failed"
    ],
    required: true
  },

  message: {
    type: String,
    trim: true,
    default: ""
  },

  anonymous: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Contribution", contributionSchema);