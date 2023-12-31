const express = require("express");
const path = require("path");
const cors = require("cors");
const db = require("./util/db");
const userModel = require("./models/user");
const expenseModel = require("./models/expense");
const orderModel = require("./models/order");
const ForgotPasswordRequestsModel = require("./models/ForgotPasswordRequests");
const downloadedFilesModel = require("./models/downloadedfiles");

const loginSignupRoute = require("./routes/login-signup");
const expenseRoute = require("./routes/expense");
const paymentRoute = require("./routes/payment");
const premiumRoute = require("./routes/premium");
const password = require("./routes/password");

const app = express();
// app.use(helmet());
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);
app.use(loginSignupRoute);
app.use("/password", password);
app.use("/premium", premiumRoute);
app.use(paymentRoute);
app.use(expenseRoute);
app.use((req, res) => {
  console.log(">>>>>>>>>>", req.url);
  let str = `/public/index/index.html`;
  if (req.url === "/") {
    res.sendFile(path.join(__dirname, str));
  } else {
    console.log(req.url);
    res.sendFile(path.join(__dirname, req.url));
  }
});

userModel.hasMany(orderModel);
userModel.hasMany(expenseModel);
userModel.hasMany(ForgotPasswordRequestsModel);
userModel.hasMany(downloadedFilesModel);

db.sync().then(() => {
  app.listen("9000");
});
