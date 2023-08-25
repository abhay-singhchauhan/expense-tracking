const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");

const loginSignupRoute = require("./routes/login-signup");

const db = require("./util/db");
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use(loginSignupRoute);
app.use("/", (req, res) => {
  res.send("Hello World");
});

db.sync().then(() => {
  app.listen("9000");
});
