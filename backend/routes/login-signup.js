const express = require("express");
const app = express.Router();
const controller = require("../controllers/login-signup-control");

app.post("/signup", controller.signup);

module.exports = app;
