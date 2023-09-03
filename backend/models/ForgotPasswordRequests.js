const sequelize = require("../util/db");
const Sequelize = require("sequelize");

const ForgotPasswordRequests = sequelize.define("ForgotPasswordRequests", {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = ForgotPasswordRequests;
