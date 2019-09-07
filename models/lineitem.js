"use strict";
module.exports = (sequelize, DataTypes) => {
  const LineItem = sequelize.define(
    "LineItem",
    {
      orderId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      inventoryId: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      extendedPrice: DataTypes.INTEGER,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      depositfee: DataTypes.INTEGER,
      deliveryfee: DataTypes.INTEGER
    },
    {}
  );
  LineItem.associate = function(models) {
    LineItem.belongsTo(models.Order, {
      foreignKey: "id",
      sourceKey: "orderId"
    });
    LineItem.belongsTo(models.Product);
    LineItem.belongsTo(models.Inventory);
  };
  return LineItem;
};
