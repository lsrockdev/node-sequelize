"use strict";
module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define(
    "Inventory",
    {
      name: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      description: DataTypes.STRING,
      deliveryFee: DataTypes.INTEGER,
      createdBy: DataTypes.INTEGER,
      modifiedBy: DataTypes.INTEGER,
      isActive: DataTypes.BOOLEAN,
      isDeleted: DataTypes.BOOLEAN,
      categorySizeId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      storeId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
      storeTapId: DataTypes.INTEGER,
      kegtypeId: DataTypes.INTEGER,
      isKeg: DataTypes.BOOLEAN,
      depositFee: DataTypes.INTEGER,
      price: DataTypes.INTEGER
    },
    {}
  );
  Inventory.associate = function(models) {
    Inventory.belongsTo(models.Product);
    Inventory.belongsTo(models.Store);
    Inventory.belongsTo(models.Category);
    Inventory.hasMany(models.Store);
  };
  return Inventory;
};
