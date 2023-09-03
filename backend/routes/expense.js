const express = require("express");
const app = express.Router();
const controller = require("../controllers/expense-control");
const auth = require("../middlewears/auth");

app.post("/addexpense", auth.auth, controller.addExpense);
app.get("/getexpenses", auth.auth, controller.getExpenses);
app.delete("/delete/:id", auth.auth, controller.deleteExpense);

module.exports = app;
