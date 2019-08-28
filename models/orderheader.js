'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrderHeader = sequelize.define('OrderHeader', {
    totalPrice: DataTypes.DOUBLE,
    orderDate: DataTypes.DATE,
    shippingAddress: DataTypes.INTEGER,
    billingAddress: DataTypes.INTEGER,
    createdBy: DataTypes.INTEGER,
    modifiedBy: DataTypes.INTEGER,
    orderNo: DataTypes.STRING,
    tip: DataTypes.DOUBLE,
    status: DataTypes.INTEGER,
    deliveredAt: DataTypes.DATE,
    returnedAt: DataTypes.DATE,
    slotStart: DataTypes.DATE,
    slotEnd: DataTypes.DATE,
    failedStatus: DataTypes.INTEGER,
    penality: DataTypes.DOUBLE,
    cumulativeDeliveryfees: DataTypes.DOUBLE,
    paymentSettlementType: DataTypes.INTEGER,
    refundedAmount: DataTypes.DOUBLE,
    noOfkegsPicked: DataTypes.INTEGER,
    noOfTapsPicked: DataTypes.INTEGER,
    noOfAttempts: DataTypes.INTEGER,
    orderSettled: DataTypes.BOOLEAN,
    customerId: DataTypes.INTEGER,
    userDeliveredBy: DataTypes.INTEGER,
    userReturnedBy: DataTypes.INTEGER
  }, {});
  OrderHeader.associate = function(models) {
    // associations can be defined here
  };
  return OrderHeader;
};