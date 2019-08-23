'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    hastap: DataTypes.BOOLEAN,
    quantity: DataTypes.DOUBLE,
    price: DataTypes.DOUBLE,
    customerId: DataTypes.INTEGER,
    inventoryId: DataTypes.INTEGER,
    deleted: DataTypes.BOOLEAN
  }, {});
  Cart.associate = function(models) {
    // associations can be defined here
  };
  return Cart;
};