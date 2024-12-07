const jwt = require("jsonwebtoken");
const Register = require("../models/Login/register");

const verifyToken = async (req, res, next) => {
  try {
    const authToken = req.header("auth-token");
    const verifyToken = jwt.verify(authToken, process.env.SECRETKEY);
    const findUser = await Register.findById(verifyToken.id);

    if (findUser) {
      req.user = findUser._id;
      next();
    } else
      res
        .status(404)
        .send({ error: "Invalid User Token please type correct token!" });
  } catch (err) {
    res.status(404).send(err);
  }
};

const verifyAdminToken = async (req, res, next) => {
  try {
    const authToken = req.header("auth-token");
    const verifyToken = jwt.verify(authToken, process.env.SECRETKEY);
    const findUser = await Register.findOne({
      _id: verifyToken.id,
      partThree: "success",
    });
    req.adminToken = findUser;
    next();
  } catch (err) {
    res.status(404).send(err);
  }
};

module.exports = { verifyAdminToken, verifyToken };
