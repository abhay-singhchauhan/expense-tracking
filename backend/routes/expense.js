const express = require("express");
const app = express.Router();
const controller = require("../controllers/expense-control");

app.post("/addexpense", controller.addExpense);
app.get("/getexpenses", controller.getExpenses);
app.delete("/delete/:id", controller.deleteExpense);

module.exports = app;
