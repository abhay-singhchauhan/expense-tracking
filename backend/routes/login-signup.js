const express = require("express");
const app = express.Router();
const controller = require("../controllers/login-signup-control");

app.post("/signup", controller.signup);
app.post("/login", controller.login);
module.exports = app;
