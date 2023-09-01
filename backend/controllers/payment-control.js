const Order = require("../models/order");
const User = require("../models/user");
const Razorpay = require("razorpay");
const jwt = require("jsonwebtoken");

require("dotenv").config();
function auth(name, id, isPremium) {
  const key = process.env.jwt_secret;
  return jwt.sign({ name: name, id: id, isPremium: isPremium }, key);
}

exports.payPremium = (req, res, next) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.key_id,
      key_secret: process.env.key_secret,
    });

    const options = {
      amount: 299 * 100,
      currency: "INR",
    };

    instance.orders.create(options, async (err, order) => {
      if (!err) {
        await Order.create({
          userId: req.user,
          status: "PENDING",
          id: order.id,
          paymentId: null,
        });
        res.json({ key: process.env.key_id, order: order });
      } else {
        res.send(err);
      }
    });
  } catch (err) {}
};

exports.updateStatus = async (req, res, next) => {
  console.log(">>>>>>>>>> done");
  const { razorpay_order_id, razorpay_payment_id } = req.body.response;
  console.log(req.body);
  console.log(razorpay_order_id, razorpay_payment_id);
  try {
    await Order.update(
      { paymentId: razorpay_payment_id, status: "SUCCESS" },
      { where: { id: razorpay_order_id } }
    );
    await User.update({ isPremium: true }, { where: { id: req.user } });
    let user = await User.findAll({ where: { id: req.user } });
    res.json({
      auth: auth(user[0].name, user[0].id, user[0].isPremium),
      message: "success",
    });
  } catch (err) {
    console.log("error inside updateStatus function", err);
    res.json({ message: "failed" });
  }
};
