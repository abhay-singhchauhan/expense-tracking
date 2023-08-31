const Expense = require("../models/expense");
const User = require("../models/user");

exports.addExpense = async (req, res) => {
  const { category, price, description } = req.body;
  try {
    await Expense.create({
      userId: req.user,
      category: category,
      price: price,
      description: description,
    });
  } catch (error) {}
};

exports.getExpenses = async (req, res, next) => {
  try {
    const data = await Expense.findAll({
      where: {
        userId: req.user,
      },
    });
    const user = await User.findAll({ where: { id: req.user } });
    res.json({ data: data, isPremium: user[0].isPremium });
  } catch (err) {}
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const dataExists = await Expense.findAll({
      where: {
        id: req.params.id,
        userId: req.user,
      },
    });

    if (dataExists.length !== 0) {
      const done = await Expense.destroy({ where: { id: req.params.id } });
      if (done) {
        res.json({
          message: "OK",
        });
      } else {
        res.json({
          message: "There is some problem",
        });
      }
    } else {
      res.json({
        message: "Cannot access this feature",
      });
    }
  } catch (Err) {}
};
