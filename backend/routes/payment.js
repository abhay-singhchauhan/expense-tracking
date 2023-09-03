const express = require("express");
const app = express.Router();
const controller = require("../controllers/payment-control");
const auth = require("../middlewears/auth");

app.get("/payforpremium", auth.auth, controller.payPremium);
app.post("/updatestatus", auth.auth, controller.updateStatus);
module.exports = app;
