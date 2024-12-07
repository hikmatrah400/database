const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://root:12345@cluster0.34zb1.mongodb.net/azizdatabase")
  .then(() => console.log("Connection is Successful"))
  .catch((e) => console.log("Connection Failed", e));
