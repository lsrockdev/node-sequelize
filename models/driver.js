'use strict';
module.exports = (sequelize, DataTypes) => {
  const Driver = sequelize.define('Driver', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    lastLogin: DataTypes.DATE,
    gender: DataTypes.INTEGER,
    dob: DataTypes.DATE
  }, {});
  Driver.associate = function(models) {
    // associations can be defined here
  };
  return Driver;
};