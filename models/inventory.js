'use strict';
module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define('Inventory', {
    name: DataTypes.STRING,
    cost: DataTypes.DOUBLE,
    quantity: DataTypes.INTEGER,
    description: DataTypes.STRING,
    depositeFee: DataTypes.DOUBLE,
    deliveryFee: DataTypes.DOUBLE,
    createdBy: DataTypes.INTEGER,
    modifiedBy: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN,
    categorySizeId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    storeId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    storeTapId: DataTypes.INTEGER,
    kegtypeId: DataTypes.INTEGER
  }, {});
  Inventory.associate = function(models) {
    // associations can be defined here
  };
  return Inventory;
};