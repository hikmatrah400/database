const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  item: {
    type: String,
    required: true,
  },
  billNum: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  retailPrice: {
    type: Number,
    required: true,
  },
  sellPrice: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  delaer: {
    type: String,
    required: this.type !== "Dealer" ? false : true,
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

const Purchase = new mongoose.model("purchaseList", purchaseSchema);
module.exports = Purchase;
