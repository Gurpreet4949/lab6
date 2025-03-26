const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  endpoint: { type: String, required: true },
  hits: { type: Number, default: 0 },
  timestamps: { type: [Date], default: [] },
});

const Analytics = mongoose.model("Analytics", analyticsSchema);

module.exports = Analytics;

