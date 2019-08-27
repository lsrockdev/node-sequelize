"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserLocation = sequelize.define(
    "UserLocation",
    {
      address1: DataTypes.STRING,
      address2: DataTypes.STRING,
      address3: DataTypes.STRING,
      type: DataTypes.INTEGER,
      latitude: DataTypes.DOUBLE,
      longitude: DataTypes.DOUBLE,
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      customerId: DataTypes.INTEGER,
      stateId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER
    },
    {}
  );
  UserLocation.associate = function(models) {
    // associations can be defined here
  };
  return UserLocation;
};
