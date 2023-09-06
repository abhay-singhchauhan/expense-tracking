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
  console.log(req.params.number, req.query.page);
  try {
    const count = await Expense.count({ where: { userId: req.user } });
    console.log(count);
    let pages = Math.ceil(+count / +req.params.number);
    let pages2 = pages;
    let arr = [];
    arr[0] = 0;
    for (let i = 0; i < pages2; i++) {
      arr[i + 1] = pages;
      pages--;
    }
    console.log(arr);
    oset = count - +req.query.page * +req.params.number - 1;
    if (count - +req.query.page * +req.params.number - 1 < 0) {
      oset = 0;
    }
    const data = await Expense.findAll({
      where: {
        userId: req.user,
      },
      offset: oset,
      limit: +req.params.number,
    });
    // console.log(data);

    let obj = { current: req.query.page };
    if (req.query.page > 1) {
      obj.hasPrevious = true;
    } else {
      obj.hasPrevious = false;
    }
    if (oset === 0) {
      obj.hasNext = false;
    } else {
      obj.hasNext = true;
    }
    res.json({ data: data, obj });
  } catch (err) {
    console.log(err);
  }
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
