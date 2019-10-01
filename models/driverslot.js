"use strict";

module.exports = (sequelize, DataTypes) => {
  const DriverSlot = sequelize.define(
    "DriverSlot",
    {
      driverId: DataTypes.INTEGER,
      slotId: DataTypes.INTEGER
    },
    {}
  );

  DriverSlot.associate = function(models) {};

  return DriverSlot;
};
