const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  pageType: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  delId: {
    type: String,
    default: "",
  },
});

const Expense = new mongoose.model("expenseList", expenseSchema);
module.exports = Expense;
