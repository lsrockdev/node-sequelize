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
      createdBy: DataTypes.INTEGER,
      modifiedBy: DataTypes.INTEGER,
      isActive: DataTypes.BOOLEAN,
      isDeleted: DataTypes.BOOLEAN,
      sizeId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
      storeId: DataTypes.INTEGER,
      storeTapId: DataTypes.INTEGER,
      kegtypeId: DataTypes.INTEGER
    },
    {}
  );
  Inventory.associate = function(models) {
    Inventory.belongsTo(models.Product);
    Inventory.belongsTo(models.Store, { foreignKey: "storeId" });
    Inventory.belongsTo(models.Category);
    Inventory.belongsTo(models.Size);
    Inventory.hasMany(models.Cart, { foreignKey: "inventoryId" });
    // Inventory.belongsTo(models.CategorySizes, { foreignKey: "categorySizeId" });
    // Inventory.hasMany(models.Store);
    // Inventory.hasMany(models.LineItem);
    // Inventory.belongsToMany(models.Order, { through: models.LineItem });
  };
  return Inventory;
};
