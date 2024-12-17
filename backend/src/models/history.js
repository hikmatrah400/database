const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  pageName: {
    type: String,
    required: true,
  },
  delId: {
    type: String,
    default: "",
  },
  history: {
    type: Array,
    required: true,
  },
});

const History = new mongoose.model("history", historySchema);
module.exports = History;
