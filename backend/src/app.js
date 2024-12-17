require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const port = process.env.PORT || 10000;
require("./conn");

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));

// routers -----------------------------------------
app.use("/lockdatabase", require("./routers/Login/lockDatabase"));
app.use("/loginform", require("./routers/Login/register"));
app.use("/loginform", require("./routers/Login/login"));

app.use("/purchase", require("./routers/purchase"));
app.use("/sell", require("./routers/sell"));
app.use("/expense", require("./routers/expense"));
app.use("/history", require("./routers/history"));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
