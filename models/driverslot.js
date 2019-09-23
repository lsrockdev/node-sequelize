'use strict';

module.exports = (sequelize, DataTypes) => {

  var DriverSlot = sequelize.define('DriverSlot', {
    driverId: DataTypes.INTEGER,
    slotId: DataTypes.INTEGER
  }, {});

  DriverSlot.associate = function(models) {
    DriverSlot.belongsTo(models.Driver, { foreignKey: "driverId" });
    DriverSlot.belongsTo(models.Slot, { foreignKey: "slotId" });
  };

  return DriverSlot;
};
