const User = require("../models/user");

exports.signup = async (req, res, next) => {
  const parsedData = req.body;

  try {
    const emailExists = await User.findAll({
      where: { email: parsedData.email },
    });
    console.log(emailExists.length == 0);
    if (emailExists.length === 0) {
      const details = await User.create(parsedData);
      res.json(details);
    } else {
      res.json({ error: true });
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
  if (userExisted.length === 0) {
    res.status(404).json({
      message: "User dosen't existed, please register yourself",
      problem: "UDE",
    });
  } else if (userExisted[0].password !== req.body.password.trim()) {
    res.status(401).json({
      message: "Please enter the correct password",
      problem: "UDE",
    });
  } else {
    res.status(200).json({
      message: "Login Successfull",
      problem: "Success",
    });
  }
};
