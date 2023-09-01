const express = require("express");
const app = express.Router();
const controller = require("../controllers/premium-control");

app.get("/leaderboard", controller.getLeaderboard);

module.exports = app;
