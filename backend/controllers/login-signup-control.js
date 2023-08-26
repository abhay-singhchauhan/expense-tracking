const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.signup = async (req, res, next) => {
  const parsedData = req.body;
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
  const userExisted = await User.findAll({
    where: {
      email: req.body.email,
    },
  });

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
