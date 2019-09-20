"use strict";

const bcryptService = require("../api/services/bcrypt.service");

module.exports = (sequelize, DataTypes) => {
  const Driver = sequelize.define(
    "Driver",
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
      lastLogin: DataTypes.DATE,
      gender: DataTypes.INTEGER,
      dob: DataTypes.DATE,
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      code: DataTypes.STRING,
      otpCode: DataTypes.STRING
    },
    {}
  );

  Driver.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  Driver.associate = function(models) {
    Driver.hasMany(models.Order, { foreignKey: "deliveredBy" });
  };
  return Driver;
};
