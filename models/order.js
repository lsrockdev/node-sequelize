"use strict";
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      subtotal: DataTypes.INTEGER,
      tax: DataTypes.INTEGER,
      discount: DataTypes.INTEGER,
      total: DataTypes.INTEGER,
      tip: DataTypes.INTEGER,
      deliveryFees: DataTypes.INTEGER,
      deliveryAddress: DataTypes.STRING,
      status: DataTypes.INTEGER,
      failedStatus: DataTypes.INTEGER,
      penalty: DataTypes.INTEGER,
      deliveredAt: DataTypes.DATE,
      returnedAt: DataTypes.DATE,
      slotStart: DataTypes.DATE,
      slotEnd: DataTypes.DATE,
      refundedAmount: DataTypes.INTEGER,
      kegsDeliveredQty: DataTypes.INTEGER,
      tapsDeliveredQty: DataTypes.INTEGER,
      kegsReturnedQty: DataTypes.INTEGER,
      tapsReturnedQty: DataTypes.INTEGER,
      customerId: DataTypes.INTEGER,
      storeId: DataTypes.INTEGER
    },
    {}
  );
  Order.associate = function(models) {
    Order.belongsTo(models.Customer, {
      foreignKey: "id",
      sourceKey: "customerId"
    });
    Order.belongsTo(models.Store, {
      foreignKey: "id",
      sourceKey: "storeId"
    });
  };
  return Order;
};
