const Sib = require("sib-api-v3-sdk");
require("dotenv").config();
const client = Sib.ApiClient.instance;
const apiKey = client.authentications["api-key"];
let key = process.env.email_key;
apiKey.apiKey = key;
console.log(key);
exports.resetPassword = async (req, res, next) => {
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
  try {
    const sendEmail = await apiInstance.sendTransacEmail({
      sender,
      to: receivers,
      subject: "ese hi",
      textContent: "hmm acha bete",
      htmlContent: "<h1>Just testing this</h1>",
    });
    return res.send(sendEmail);
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};
