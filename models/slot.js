'use strict';

module.exports = (sequelize, DataTypes) => {

  var Slot = sequelize.define('Slot', {
    start: DataTypes.DATE,
    finish: DataTypes.DATE
  }, {});

  Slot.associate = function(models) {
    Slot.hasMany(models.Order)
    Slot.hasMany(models.DriverSlot);
    Slot.belongsToMany(models.Driver, { through: models.DriverSlot });
  };

  return Slot;
};
