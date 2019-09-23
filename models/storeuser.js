"use strict";
module.exports = (sequelize, DataTypes) => {
  const StoreUser = sequelize.define(
    "StoreUser",
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      userName: DataTypes.STRING,
      lastLogin: DataTypes.DATE,
      gender: DataTypes.INTEGER,
      isFbUser: DataTypes.BOOLEAN,
      dob: DataTypes.DATE,
      code: DataTypes.TEXT
    },
    {}
  );
  StoreUser.associate = function(models) {
    StoreUser.hasOne(models.Store, { foreignKey: "userId" });

    // associations can be defined here
  };
  return StoreUser;
};
