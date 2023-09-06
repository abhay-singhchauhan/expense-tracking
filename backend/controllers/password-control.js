const user = require("../models/user");
const path = require("path");
const forgetpasswordlink = require("../models/ForgotPasswordRequests");
const Sib = require("sib-api-v3-sdk");
require("dotenv").config();
const client = Sib.ApiClient.instance;
const apiKey = client.authentications["api-key"];
let key = process.env.email_key;
apiKey.apiKey = key;
const { v4: uuidv4 } = require("uuid");
const passwordReset = require("../util/passwordresponse");
const forgetpasswordmodel = require("../models/ForgotPasswordRequests");
const bcrypt = require("bcrypt");

exports.forgotPassword = async (req, res, next) => {
  try {
    const User = await user.findAll({ where: { email: req.body.email } });

    const apiInstance = new Sib.TransactionalEmailsApi();
    const sender = {
      email: "itsyourabhay@gmail.com",
      name: "Abhay @ A Programmer",
    };
    const receivers = [
      {
        email: req.body.email,
      },
    ];

    const fp = await forgetpasswordlink.create({
      id: uuidv4(),
      isActive: true,
      userId: User[0].id,
    });
    const sendEmail = await apiInstance.sendTransacEmail({
      sender,
      to: receivers,
      subject: "ese hi",
      textContent: "hmm acha bete",
      htmlContent: `<a href='http://localhost:9000/password/resetpassword/${fp.id}'><h1>password reset link</h1></a>`,
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.json({ success: false });
  }
};

exports.resetPassword = async (req, res, next) => {
  console.log(req.params.uuid);
  const fpm = await forgetpasswordmodel.findAll({
    where: { id: req.params.uuid },
  });
  if (fpm.length > 0) {
    let id = req.params.uuid;
    console.log(passwordReset.resetResponse);
    res.status(200).send(passwordReset.resetResponse(req.params.uuid));
  } else {
    res.status(500);
  }
};

exports.resetPasswordSubmit = async (req, res, next) => {
  const findPassword = await forgetpasswordmodel.findAll({
    where: { id: req.params.uuid },
  });
  if (findPassword[0].isActive) {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (hash) {
        await user.update(
          { password: hash },
          { where: { id: findPassword[0].userId } }
        );
        await findPassword[0].update({ isActive: false });
        res.redirect("C:Projectsexpense-tracker\frontendloginlogin.html");
      }
    });
  } else {
    res.status(500).send("please");
  }
};
