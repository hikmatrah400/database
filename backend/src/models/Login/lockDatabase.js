const mongoose = require("mongoose");

const lockDatabaseSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  database: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const lockDatabase = new mongoose.model("lockDatabase", lockDatabaseSchema);
module.exports = lockDatabase;
