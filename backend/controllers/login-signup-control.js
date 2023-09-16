const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function auth(name, id, isPremium) {
  const key = process.env.jwt_secret;
  return jwt.sign({ name: name, id: id, isPremium: isPremium }, key);
}

exports.signup = async (req, res, next) => {
  const parsedData = req.body;
  req;
  try {
    const emailExists = await User.findAll({
      where: { email: parsedData.email },
    });
    if (emailExists.length === 0) {
      bcrypt.hash(parsedData.password, 10, async (err, hash) => {
        console.log("hash>>>>", hash);
        if (err) {
          throw new Error("There is some problem");
        } else {
          const details = await User.create({
            name: parsedData.name,
            email: parsedData.email,
            isPremium: false,
            password: hash,
            total: 0,
          });
          res.status(200).json(details);
        }
      });
    } else {
      res.status(500).json({ error: true });
    }
  } catch (err) {
    "there are some problems", err;
  }
};

exports.login = async (req, res, next) => {
  req.body;
  const userExisted = await User.findAll({
    where: {
      email: req.body.email,
    },
  });
  userExisted;
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
          success;

          res.status(200).json({
            auth: auth(
              userExisted[0].name,
              userExisted[0].id,
              userExisted[0].isPremium
            ),
            message: "Login Successfull",
            problem: "Success",
          });
        } else {
          success;
          res.status(401).json({
            message: "Please enter the correct password",
            problem: "UDE",
          });
        }
      }
    );
  }
};
