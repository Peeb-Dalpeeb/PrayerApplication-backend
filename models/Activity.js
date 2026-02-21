const mongoose = require("mongoose");

// 1. Define the Blueprint (Schema)
const activitySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true, // This makes sure no two records accidentally get the same ID
  },
  student: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    enum: ["spinner", "prayer"], // Strict rule: must be one of these two words
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// 2. Build the Model and export it
const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
