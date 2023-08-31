const sequelize = require("../util/db");
const Sequelize = require("sequelize");

const Expense = sequelize.define("order", {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  paymentId: {
    type: Sequelize.STRING,
  },
});

module.exports = Expense;
