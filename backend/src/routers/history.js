const express = require("express");
const router = new express.Router();
const History = require("../models/history");
const { verifyToken } = require("../Functions/Functions");

router.get("/getData", async (req, res) => {
  try {
    const data = await History.find({});
    res.status(201).send(data);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.post("/saveData", verifyToken, async (req, res) => {
  try {
    const id = req.body._id;
    const findHistory = await History.findOne({
      _id: id,
      pageName: req.body.pageName,
    });

    if (findHistory !== null) {
      const newData = await History.findByIdAndUpdate(
        id,
        {
          ...req.body,
          history: [...findHistory.history, ...req.body.history],
        },
        {
          new: true,
        }
      );

      res.status(201).send({
        message: "History Updated Item Successfully.",
        updated_data: newData,
      });
    } else {
      const newData = await History.create(req.body);

      res
        .status(201)
        .send({ message: "History Saved Successfully.", data: newData });
    }
  } catch (err) {
    res.status(404).send(err);
  }
});

//------------------------------------------------------------

router.put("/updateData/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const { hisID, value, bool } = req.body;

    const findData = await History.findOne({ _id: id });

    const findUpdatedHis = findData
      ? findData.history.filter((elm) => elm._id === hisID)
      : [];
    const findUnUpdatedHis = findData
      ? findData.history.filter((elm) => elm._id !== hisID)
      : [];

    const newData = await History.updateOne(
      { _id: id },
      {
        $set: {
          history: [
            ...findUnUpdatedHis,
            { ...findUpdatedHis[0], [value]: bool },
          ],
        },
      }
    );

    res.status(201).send({
      message: "History Item Updated Successfully.",
      updated_data: newData,
    });
  } catch (err) {
    res.status(404).send(err);
  }
});

router.patch("/deleteData/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const { remainData, deletedData } = req.body;

    const findUser = await History.findById(id);
    const emptyHistory = findUser.history.length - deletedData.length;

    if (emptyHistory === 0) {
      const newData = await History.findByIdAndDelete(id, {
        new: true,
      });

      res.status(201).send({
        message: "History Deleted Successfully.",
        deleted_data: newData,
      });
    } else {
      const newData = await History.updateOne(
        { _id: id },
        {
          $set: {
            history: [...remainData],
          },
        }
      );

      res.status(201).send({
        message: "History Item Deleted Successfully.",
        deleted_data: newData,
      });
    }
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router;
