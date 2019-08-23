const Sequelize = require("sequelize");
const bcryptService = require("../services/bcrypt.service");

const sequelize = require("../../config/database");

const hooks = {
  beforeCreate(customer) {
    customer.password = bcryptService().password(customer);
  }
};

const tableName = "Customer";

const Customer = sequelize.define(
  "Customer",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    phone: {
      type: Sequelize.STRING
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
      type: Sequelize.INTEGER
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
