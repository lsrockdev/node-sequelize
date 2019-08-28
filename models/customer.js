"use strict";
const bcryptService = require("../api/services/bcrypt.service");

// const hooks = {
//   beforeCreate(customer) {
//     customer.password = bcryptService().password(customer);
//   }
// };

module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    "Customer",
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      userName: DataTypes.STRING,
      address: DataTypes.JSON,
      isActive: DataTypes.BOOLEAN,
      lastLogin: DataTypes.DATE,
      gender: DataTypes.INTEGER,
      isFbUser: DataTypes.BOOLEAN,
      secondaryContact: DataTypes.STRING,
      secondaryContactName: DataTypes.STRING,
      stateId: DataTypes.INTEGER,
      otpCode: DataTypes.STRING
    },
    {}
  );

  Customer.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  };

  Customer.associate = function(models) {
    return models;
  };
  return Customer;
};
