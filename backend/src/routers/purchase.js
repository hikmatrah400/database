const express = require("express");
const router = new express.Router();
const Purchase = require("../models/purchase");
const { verifyToken } = require("../Functions/Functions");

router.get("/getData", async (req, res) => {
  try {
    const data = await Purchase.find({});
    res.status(201).send(data);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.post("/saveData", verifyToken, async (req, res) => {
  try {
    const newData = await Purchase.create({
      ...req.body,
      user: req.user,
    });

    res
      .status(201)
      .send({ message: "Record Saved Successfully.", data: newData });
  } catch (err) {
    res.status(404).send(err);
  }
});

router.put("/updateData/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const newData = await Purchase.findByIdAndUpdate(
      id,
      {
        ...req.body,
        user: req.user,
      },
      {
        new: true,
      }
    );

    res
      .status(201)
      .send({ message: "Record Updated Successfully.", updated_data: newData });
  } catch (err) {
    res.status(404).send(err);
  }
});

router.delete("/deleteData/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const newData = await Purchase.findByIdAndDelete(id, {
      new: true,
    });

    res
      .status(201)
      .send({ message: "Record Deleted Successfully.", deleted_data: newData });
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router;
