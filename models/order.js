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
      deliveryAddress: {
        type: DataTypes.TEXT,
        get: function() {
          return JSON.parse(this.getDataValue("deliveryAddress"));
        },
        set: function(value) {
          return this.setDataValue("deliveryAddress", JSON.stringify(value));
        }
      },
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
      storeId: DataTypes.INTEGER,
      paymentCompleted: DataTypes.BOOLEAN,
      billingAddress: {
        type: DataTypes.TEXT,
        get: function() {
          return JSON.parse(this.getDataValue("billingAddress"));
        },
        set: function(value) {
          return this.setDataValue("billingAddress", JSON.stringify(value));
        }
      },
      stripeToken: DataTypes.STRING
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
    Order.hasMany(models.LineItem);
    // Order.belongsToMany(models.Product, { through: models.LineItem });
    Order.belongsToMany(models.Inventory, { through: models.LineItem });
  };
  return Order;
};
