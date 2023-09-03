const express = require("express");
const app = express.Router();
const controller = require("../controllers/premium-control");
const auth = require("../middlewears/auth");

app.get("/leaderboard", auth.auth, controller.getLeaderboard);

module.exports = app;
