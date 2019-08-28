'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('OrderHeaders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      totalPrice: {
        type: Sequelize.DOUBLE
      },
      orderDate: {
        type: Sequelize.DATE
      },
      shippingAddress: {
        type: Sequelize.INTEGER
      },
      billingAddress: {
        type: Sequelize.INTEGER
      },
      createdBy: {
        type: Sequelize.INTEGER
      },
      modifiedBy: {
        type: Sequelize.INTEGER
      },
      orderNo: {
        type: Sequelize.STRING
      },
      tip: {
        type: Sequelize.DOUBLE
      },
      status: {
        type: Sequelize.INTEGER
      },
      deliveredAt: {
        type: Sequelize.DATE
      },
      returnedAt: {
        type: Sequelize.DATE
      },
      slotStart: {
        type: Sequelize.DATE
      },
      slotEnd: {
        type: Sequelize.DATE
      },
      failedStatus: {
        type: Sequelize.INTEGER
      },
      penality: {
        type: Sequelize.DOUBLE
      },
      cumulativeDeliveryfees: {
        type: Sequelize.DOUBLE
      },
      paymentSettlementType: {
        type: Sequelize.INTEGER
      },
      refundedAmount: {
        type: Sequelize.DOUBLE
      },
      noOfkegsPicked: {
        type: Sequelize.INTEGER
      },
      noOfTapsPicked: {
        type: Sequelize.INTEGER
      },
      noOfAttempts: {
        type: Sequelize.INTEGER
      },
      orderSettled: {
        type: Sequelize.BOOLEAN
      },
      customerId: {
        type: Sequelize.INTEGER
      },
      userDeliveredBy: {
        type: Sequelize.INTEGER
      },
      userReturnedBy: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('OrderHeaders');
  }
};