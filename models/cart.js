"use strict";
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define(
    "Cart",
    {
      hastap: DataTypes.BOOLEAN,
      quantity: DataTypes.DOUBLE,
      price: DataTypes.DOUBLE,
      customerId: DataTypes.INTEGER,
      inventoryId: DataTypes.INTEGER,
      isDeleted: DataTypes.BOOLEAN
    },
    {}
  );
  Cart.associate = function(models) {
    Cart.belongsTo(models.Customer, { foreignKey: "customerId" });
    Cart.belongsTo(models.Inventory, { foreignKey: "inventoryId" });
  };
  return Cart;
};
