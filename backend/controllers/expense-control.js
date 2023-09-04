const Expense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../util/db");
const aws = require("aws-sdk");

exports.addExpense = async (req, res) => {
  const t = await sequelize.transaction();
  const { category, price, description } = req.body;
  try {
    await Expense.create(
      {
        userId: req.user,
        category: category,
        price: price,
        description: description,
      },
      { transaction: t }
    );
    const user = await User.findByPk(req.user);
    await user.update({ total: +user.total + +price }, { transaction: t });
    await t.commit();
  } catch (error) {
    await t.rollback();
    res.json(error);
  }
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
  const t = await sequelize.transaction();
  try {
    const dataExists = await Expense.findAll({
      where: {
        id: req.params.id,
        userId: req.user,
      },
    });

    await Expense.destroy({ where: { id: req.params.id } }, { transaction: t });
    const user = await User.findByPk(req.user);
    await User.update(
      { total: +user.total - +dataExists[0].price },
      { where: { id: req.user } },
      { transaction: t }
    );
    await t.commit();
    res.status(200).json({ message: "OK" });
  } catch (err) {
    await t.rollback();
    res.json(err);
  }
};

exports.download = async (req, res, next) => {
  const expenses = await Expense.findAll({ where: { id: req.user } });
  console.log(expenses);
};
