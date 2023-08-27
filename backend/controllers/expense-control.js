const Expense = require("../models/expense");

exports.addExpense = async (req, res) => {
  const { category, price, description } = req.body;
  try {
    await Expense.create({
      userId: req.user,
      category: category,
      price: price,
      description: description,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getExpenses = async (req, res, next) => {
  try {
    const data = await Expense.findAll({
      where: {
        userId: req.user,
      },
    });

    res.json(data);
  } catch (err) {
    console.log(">>>>> error", err);
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    console.log("params >>>>", req.params);
    const dataExists = await Expense.findAll({
      where: {
        id: req.params.id,
        userId: req.user,
      },
    });
    console.log("dataExists >>>>>", dataExists);
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
  } catch (Err) {
    console.log(Err);
  }
};
