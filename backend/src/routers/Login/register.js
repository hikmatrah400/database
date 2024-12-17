const express = require("express");
const router = new express.Router();
const Regiser = require("../../models/Login/register");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { verifyAdminToken } = require("../../Functions/Functions");

const BadgeColor = () => {
  const badgeColors = [
    "#008e00",
    "#0066ff",
    "#9000ff",
    "#c20000",
    "#009dbc",
    "#bc7100",
  ];
  const newBadge = badgeColors[Math.floor(Math.random() * badgeColors.length)];

  return newBadge;
};

router.get("/register", async (req, res) => {
  try {
    const getUsers = await Regiser.find({});
    console.log(getUsers);
    res.status(201).send(getUsers);
  } catch (err) {
    res.status(404).send({ error: err });
  }
});

router.get("/register/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const getUser = await Regiser.findById(id);

    res.status(201).send(getUser);
  } catch (err) {
    res.status(404).send({ error: err });
  }
});

router.post("/register", verifyAdminToken, async (req, res) => {
  try {
    if (req.adminToken) {
      const { email, password, confirmPassword } = req.body;
      const newBadge = BadgeColor();

      if (req.body.email && !validator.isEmail(email)) {
        res.status(404).send({ message: "Enter a valid Email Address!" });
      } else if (password !== confirmPassword) {
        res
          .status(404)
          .send({ message: "Password was not Correctly confirmed!" });
      } else {
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);

        const newUser = await Regiser.create({
          ...req.body,
          password: secPass,
          confirmPassword: "confirmed",
          partThree: "failed",
          badgeColor: req.body.partThree === "success" ? "#1a73e8" : newBadge,
        });

        res.status(201).send({
          message: "Account Created Successfully.",
          new_user: newUser,
        });
      }
    } else {
      res.status(404).send({ message: "Please Enter Correct Token to Save" });
    }
  } catch (err) {
    res.status(404).send({ error: err });
  }
});

router.put("/register/:id", verifyAdminToken, async (req, res) => {
  try {
    if (req.adminToken) {
      const id = req.params.id;

      const { email, password, confirmPassword, nvigateTo, nvigateType } =
        req.body;
      const userPageData = {
        partThree: id === req.adminToken.id ? "success" : "failed",
        nvigateTo:
          id === req.adminToken.id
            ? "all"
            : nvigateTo === "all"
            ? "afghanAndDealer"
            : nvigateTo,
        nvigateType:
          id === req.adminToken.id
            ? "all"
            : nvigateType === "all"
            ? "Purchaser"
            : nvigateType,
      };

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(
        password !== undefined ? password : "",
        salt
      );

      if (req.body.email && !validator.isEmail(email))
        res.status(404).send({ message: "Enter a valid Email Address!" });
      else {
        if (password === undefined && confirmPassword === undefined) {
          const getUser = await Regiser.findByIdAndUpdate(
            id,
            {
              ...req.body,
              ...userPageData,
            },
            {
              new: true,
            }
          );

          res.status(201).send({
            message: "Account Updated Successfully.",
            updated_user: getUser,
          });
        } else {
          if (password === confirmPassword) {
            const getUser = await Regiser.findByIdAndUpdate(
              id,
              {
                ...req.body,
                password: secPass,
                confirmPassword: "confirmed",
                ...userPageData,
              },
              {
                new: true,
              }
            );

            res.status(201).send({
              message: "Account Updated Successfully.",
              updated_user: getUser,
            });
          } else
            res
              .status(404)
              .send({ message: "Password was not Correctly confirmed!" });
        }
      }
    } else {
      res.status(404).send({ message: "Please Enter Correct Token to Update" });
    }
  } catch (err) {
    res.status(404).send({ message: "No Account Found!", error: err });
  }
});

router.delete("/register/:id", verifyAdminToken, async (req, res) => {
  try {
    if (req.adminToken) {
      const id = req.params.id;
      const delRegister = await Regiser.findByIdAndDelete(id, { new: true });

      res.status(201).send({
        message: "Account Deleted Successfully!",
        deleted_user: delRegister,
      });
    } else {
      res.status(404).send({ message: "Please Enter Correct Token to Delete" });
    }
  } catch (err) {
    res.status(404).send({ message: "No Account Found!", error: err });
  }
});

module.exports = router;
