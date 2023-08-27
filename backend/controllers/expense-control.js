// const Expense = require("../models/expense");

exports.addExpense = async (req, res) => {
  const { category, price, description } = req.body;
  try {
    res.json(req.body);
    console.log(req.body);
  } catch (error) {
    console.log(error);
  }
};
