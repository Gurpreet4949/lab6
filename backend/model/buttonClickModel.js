const mongoose = require("mongoose");

const buttonClickSchema = new mongoose.Schema({
  buttonId: { type: String, required: true },
  timestamp: { type: Date, required: true },
  userId: { type: String },
  username: { type: String, default: 'guest' },
  userAgent: { type: String },
  ipAddress: { type: String }
});

const ButtonClick = mongoose.model("ButtonClick", buttonClickSchema);

module.exports = ButtonClick;
