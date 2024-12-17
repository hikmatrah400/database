const express = require("express");
const router = new express.Router();
const bcrypt = require("bcryptjs");
const Regiser = require("../../models/Login/register");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Regiser.findOne({ username: username });
    const isMatch = await bcrypt.compare(password, user.password);

    const data = { id: user.id };
    const authToken = jwt.sign(data, process.env.SECRETKEY);

    if (!isMatch) {
      res.status(404).send("Wrong username or password");
    } else {
      res.status(201).send({
        message: "Login Success",
        user: user.username,
        badgeColor: user.badgeColor,
        nvigateTo: user.nvigateTo,
        nvigateType: user.nvigateType,
        authToken,
      });
    }
  } catch (err) {
    res.status(404).send("Wrong username or password");
  }
});

router.post("/adminpassword", async (req, res) => {
  try {
    const authToken = req.header("auth-token");
    const verifyToken = jwt.verify(authToken, process.env.SECRETKEY);
    const getData = await Regiser.findOne({
      _id: verifyToken.id,
      partThree: "success",
    });
    const isMatch = await bcrypt.compare(req.body.password, getData.password);

    if (!isMatch) {
      res.status(404).send("Invalid Admin Password");
    } else {
      res.status(201).send({
        message: "Password Confirmed Successfully!",
      });
    }
  } catch (err) {
    res.status(404).send("Invalid Admin Password");
  }
});

router.get("/verifyToken", async (req, res) => {
  try {
    const authToken = req.header("auth-token");
    const verifyToken = jwt.verify(authToken, process.env.SECRETKEY);
    const getData = await Regiser.findById(verifyToken.id);
    res.status(201).send({ userData: getData, load: false });
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router;
