const express = require("express");
const controller = require("../controllers/password-control");

const app = express.Router();

app.post("/forgotpassword", controller.forgotPassword);
app.get("/resetpassword/:uuid", controller.resetPassword);
app.post("/resetpasswordsubmit/:uuid", controller.resetPasswordSubmit);

module.exports = app;
