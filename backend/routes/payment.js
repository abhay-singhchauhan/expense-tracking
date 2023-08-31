const express = require("express");
const app = express.Router();
const controller = require("../controllers/payment-control");

app.get("/payforpremium", controller.payPremium);
app.post("/updatestatus", controller.updateStatus);
module.exports = app;
