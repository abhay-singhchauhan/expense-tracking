const express = require("express");
const app = express.Router();
const controller = require("../controllers/expense-control");

app.post("/addexpense", controller.addExpense);

module.exports = app;
