const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true,
    trim: true
  },

  minimumAmount: {
    type: Number,
    required: true,
    min: 1
  }
});

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },

  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },

  story: {
    type: String,
    required: true,
    trim: true
  },

  category: {
    type: String,
    required: true,
    enum: [
      "Technology",
      "Art",
      "Music",
      "Film",
      "Food",
      "Community",
      "Education",
      "Health"
    ]
  },

  fundingGoal: {
    type: Number,
    required: true,
    min: 1000
  },

  currentFunding: {
    type: Number,
    default: 0
  },

  currency: {
    type: String,
    default: "PKR"
  },

  deadline: {
    type: Date,
    required: true
  },

  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  status: {
    type: String,
    enum: [
      "active",
      "funded",
      "expired",
      "cancelled"
    ],
    default: "active"
  },

  coverImage: {
    type: String,
    default: "#00f5ff"
  },

  rewards: [rewardSchema],

  backerCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Project", projectSchema);