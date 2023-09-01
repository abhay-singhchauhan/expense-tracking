const Expense = require("../models/expense");
const User = require("../models/user");
const totalExpense = require("../models/totalExpense");

exports.addExpense = async (req, res) => {
  const { category, price, description } = req.body;
  try {
    await Expense.create({
      userId: req.user,
      category: category,
      price: price,
      description: description,
    });
    const total = await totalExpense.findAll({ where: { userId: req.user } });
    await totalExpense.update(
      { total: +total[0].total + +price },
      { where: { UserId: req.user } }
    );
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
      const expense = await Expense.findByPk(req.params.id);
      const done = await Expense.destroy({ where: { id: req.params.id } });
      console.log(done);
      const totalU = await totalExpense.findAll({
        where: { userId: req.user },
      });
      await totalExpense.update(
        { total: +totalU[0].total - +expense.price },
        { where: { userId: req.user } }
      );
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
