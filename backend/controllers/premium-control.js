const User = require("../models/user");
const Expense = require("../models/expense");
const sequelize = require("../util/db");
const AWS = require("aws-sdk");
const downloadedFiles = require("../models/downloadedfiles");

require("dotenv").config();

exports.getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await User.findAll({
      order: [["total", "DESC"]],
      attributes: ["name", "total"],
    });
    res.status(200).json(leaderboard);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

async function uploadToS3(filename, data) {
  const BUCKET_NAME = "expensetrackingapplication";
  const I_AM_USER_KEY = process.env.I_AM_USER_KEY;
  const I_AM_USER_SECRET = process.env.I_AM_USER_SECRET;
  console.log(I_AM_USER_KEY, I_AM_USER_SECRET);

  const s3 = new AWS.S3({
    accessKeyId: I_AM_USER_KEY,
    secretAccessKey: I_AM_USER_SECRET,
  });

  const params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, res) => {
      if (err) {
        reject(err);
      } else {
        console.log(res);
        resolve(res.Location);
      }
    });
  });
}

exports.download = async (req, res, next) => {
  try {
    const expenses = await Expense.findAll({ where: { id: req.user } });
    const stringify = JSON.stringify(expenses[0]);
    const fileName = `Expense${expenses[0].userId}/${new Date()}.txt`;

    const fileURL = await uploadToS3(fileName, stringify);
    await downloadedFiles.create({
      fileURL: fileURL,
      userId: req.user,
    });
    res.status(200).json({ fileURL, success: true });
  } catch (err) {
    res.status(500).json({ fileURL, success: false, error: err });
  }
};

exports.sendFileHistory = async (req, res, next) => {
  try {
    const files = await downloadedFiles.findAll({
      where: { userId: req.user },
    });
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ success: false, err: err });
  }
};
