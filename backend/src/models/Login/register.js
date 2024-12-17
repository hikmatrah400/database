const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "This Account has already Existed on this Email"],
  },
  phone: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    unique: [true, "This Account has already Existed on this Username"],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  partThree: {
    type: String,
    required: true,
  },
  nvigateTo: {
    type: String,
    required: true,
  },
  nvigateType: {
    type: String,
    required: true,
  },
  badgeColor: {
    type: String,
    required: true,
  },
});

const Regiser = new mongoose.model("users", registerSchema);
module.exports = Regiser;
