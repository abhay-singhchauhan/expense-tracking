const User = require("../models/user");
const Expense = require("../models/expense");
const sequelize = require("../util/db");

exports.getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await User.findAll({
      attributes: [
        "id",
        "name",
        [sequelize.fn("sum", sequelize.col("expenses.price")), "total_cost"],
      ],
      include: [
        {
          model: Expense,
          attributes: [],
        },
      ],
      group: ["user.id"],
      order: [["total_cost", "DESC"]],
    });
    res.status(200).json(leaderboard);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
