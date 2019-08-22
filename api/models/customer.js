const Sequelize = require("sequelize");
const bcryptService = require("../services/bcrypt.service");

const sequelize = require("../../config/database");

const hooks = {
  beforeCreate(customer) {
    customer.password = bcryptService().password(customer);
  }
};

const tableName = "customers";

const Customer = sequelize.define(
  "Customer",
  {
    email: {
      type: Sequelize.STRING,
      unique: true
    },
    password: {
      type: Sequelize.STRING
    }
  },
  { hooks, tableName }
);

Customer.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

module.exports = Customer;
