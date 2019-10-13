"use strict";
module.exports = (sequelize, DataTypes) => {
  const StoreLocation = sequelize.define(
    "StoreLocation",
    {
      address1: DataTypes.STRING,
      address2: DataTypes.STRING,
      address3: DataTypes.STRING,
      city: DataTypes.STRING,
      zipCode: DataTypes.STRING,
      type: DataTypes.INTEGER,
      latitude: DataTypes.DOUBLE,
      longitude: DataTypes.DOUBLE,
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      storeId: DataTypes.INTEGER,
      stateId: DataTypes.INTEGER
    },
    {}
  );
  StoreLocation.associate = function(models) {
    // associations can be defined here
  };
  return StoreLocation;
};
