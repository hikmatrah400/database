const express = require("express");
const router = new express.Router();
const LockDatabase = require("../../models/Login/lockDatabase");
const jwt = require("jsonwebtoken");

router.get("/getLock", async (req, res) => {
  try {
    const data = await LockDatabase.find({});
    const verifyToken = jwt.verify(
      data[0].database,
      `${process.env.SECRETKEY}${data[0].message.length > 0 ? "lock" : ""}`
    );

    res.status(201).send({ data: data, value: verifyToken.value });
  } catch (err) {
    res.status(404).send(err);
  }
});

router.put("/lock/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const message = req.body.message;

    const authToken = req.header("auth-token");
    const verifyToken = jwt.verify(authToken, process.env.SECRETKEY);

    const createToken = jwt.sign(
      { value: message.length > 0 ? false : true },
      `${process.env.SECRETKEY}${message.length > 0 ? "lock" : ""}`
    );

    if (verifyToken.name) {
      const data = await LockDatabase.findByIdAndUpdate(
        id,
        {
          message: message,
          database: createToken,
        },
        {
          new: true,
        }
      );
      res.status(201).send({
        message: "Lock Database Changed Successfully.",
        updated_data: data,
      });
    } else {
      res.status(404).send({ message: "Please Enter Correct Token to Update" });
    }
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router;
