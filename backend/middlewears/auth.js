const User = require("../models/user");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

exports.auth = (req, res, next) => {
  const key = fs.readFileSync(
    path.join(__dirname, "../", "/key", "/private.key"),
    "utf-8"
  );
  console.log(key);
  const user = jwt.verify(req.headers.authorization, key);
  const userExisted = User.findAll({ where: { id: user.id } });
  console.log(">>>>>>>", user.id);
  if (userExisted.length !== 0) {
    if (!user) {
      res.json({
        message: "not auth to enter",
      });
      console.log(res);
      throw new Error("Verification failed");
    } else {
      req.user = user.id;
      next();
    }
  } else {
    res.json({
      message: "not auth to enter",
    });
  }
};
