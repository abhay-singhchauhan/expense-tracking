const User = require("../models/user");
const jwt = require("jsonwebtoken");

require("dotenv").config();

exports.auth = async (req, res, next) => {
  console.log(">>>>>>hi everyone");
  try {
    const key = process.env.jwt_secret;

    const user = jwt.verify(req.headers.authorization, key);
    const userExisted = await User.findAll({ where: { id: user.id } });

    if (userExisted.length !== 0) {
      if (!user) {
        res.json({
          message: "not auth to enter",
        });

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
  } catch (err) {
    res.json({ err });
  }
};
