const User = require("../models/user");

exports.signup = async (req, res, next) => {
  const parsedData = req.body;
  try {
    const details = await User.create(parsedData);
    res.json(details);
  } catch (err) {
    console.log("there are some problems", err);
  }
};
