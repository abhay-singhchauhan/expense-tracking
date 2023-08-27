const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const db = require("./util/db");
const loginSignupRoute = require("./routes/login-signup");
const expenseRoute = require("./routes/expense");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use(expenseRoute);
app.use(loginSignupRoute);

db.sync().then(() => {
  app.listen("9000");
});
