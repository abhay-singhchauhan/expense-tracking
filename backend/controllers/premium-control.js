const User = require("../models/user");
const Expense = require("../models/expense");
const sequelize = require("../util/db");

exports.getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await User.findAll({
      order: [["total", "DESC"]],
      attributes: ["name", "total"],
    });
    res.status(200).json(leaderboard);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
