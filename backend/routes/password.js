const express = require("express");
const controller = require("../controllers/password-control");

const app = express.Router();

app.post("/forgotpassword", controller.resetPassword);

module.exports = app;
