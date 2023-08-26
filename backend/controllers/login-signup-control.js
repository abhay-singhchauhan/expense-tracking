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
