"use strict";

const bcryptService = require("../api/services/bcrypt.service");

module.exports = (sequelize, DataTypes) => {
  const Driver = sequelize.define(
    "Driver",
    {
      email: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        get: function() {
          return this.getDataValue("password");
        },
        set: function(value) {
          this.setDataValue(
            "password",
            bcryptService().passwordString("welcome")
          );
        }
      },
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
      }
    },
    {}
  );

  Driver.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  };

  Driver.associate = function(models) {
    // associations can be defined here
  };
  return Driver;
};
