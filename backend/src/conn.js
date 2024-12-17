const mongoose = require("mongoose");

const connectionString = "mongodb+srv://root:12345@cluster0.ixgj6.mongodb.net";

// const connectionString = "mongodb://localhost:27017";

mongoose
  .connect(`${connectionString}/azizdatabase`)
  .then(() => console.log("Connection is Successful"))
  .catch((e) => console.log("Connection Failed", e));
