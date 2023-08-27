const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

function auth(name, id) {
  const key = fs.readFileSync(
    path.join(__dirname, "../", "/key", "/private.key"),
    "utf-8"
  );
  return jwt.sign({ name: name, id: id }, key);
}

exports.signup = async (req, res, next) => {
  const parsedData = req.body;
  console.log(req);
  try {
    const emailExists = await User.findAll({
      where: { email: parsedData.email },
    });
    if (emailExists.length === 0) {
      bcrypt.hash(parsedData.password, 10, async (err, hash) => {
        if (err) {
          throw new Error("There is some problem");
        } else {
          const details = await User.create({
            name: parsedData.name,
            email: parsedData.email,
            password: hash,
          });
          res.json(details);
        }
      });
    } else {
      res.status(500).json({ error: true });
    }
  } catch (err) {
    console.log("there are some problems", err);
  }
};

exports.login = async (req, res, next) => {
  console.log(req.body);
  const userExisted = await User.findAll({
    where: {
      email: req.body.email,
    },
  });
  console.log(userExisted);
  if (userExisted.length === 0) {
    res.status(404).json({
      message: "User dosen't existed, please register yourself",
      problem: "UDE",
    });
  } else {
    bcrypt.compare(
      req.body.password,
      userExisted[0].password,
      (error, success) => {
        if (success) {
          console.log(success);

          res.status(200).json({
            auth: auth(userExisted[0].name, userExisted[0].id),
            message: "Login Successfull",
            problem: "Success",
          });
        } else {
          console.log(success);
          res.status(401).json({
            message: "Please enter the correct password",
            problem: "UDE",
          });
        }
      }
    );
  }
};
