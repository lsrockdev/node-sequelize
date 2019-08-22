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
    },
    dob: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING
    },
    firstname: {
      type: Sequelize.STRING
    },
    lastname: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.JSON
    },
    isActive: {
      type: Sequelize.BOOLEAN
    },
    lastLogin: {
      type: Sequelize.DATE
    },
    gender: {
      type: Sequelize.ENUM("male", "female")
    },
    isFbUser: {
      type: Sequelize.BOOLEAN
    },
    addresses: {
      type: Sequelize.JSON
    },
    secondaryContact: {
      type: Sequelize.STRING
    },
    secondaryContactName: {
      type: Sequelize.STRING
    },
    stateId: {
      type: Sequelize.DECIMAL(10, 2)
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
