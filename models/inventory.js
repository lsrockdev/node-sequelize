"use strict";
module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define(
    "Inventory",
    {
      // Adding id PK here fixes weird sequelize issue with join table querying:
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      // Not using deliveryFee, use Category.deliveryFee instead:
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
    Inventory.belongsTo(models.Store, { foreignKey: "storeId" });
    Inventory.belongsTo(models.Category);
    Inventory.hasMany(models.Cart, { foreignKey: "inventoryId" });
    // Inventory.hasMany(models.Store);
    // Inventory.hasMany(models.LineItem);
    // Inventory.belongsToMany(models.Order, { through: models.LineItem });
  };
  return Inventory;
};
