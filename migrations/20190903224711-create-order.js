'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subtotal: {
        type: Sequelize.INTEGER
      },
      tax: {
        type: Sequelize.INTEGER
      },
      discount: {
        type: Sequelize.INTEGER
      },
      total: {
        type: Sequelize.INTEGER
      },
      tip: {
        type: Sequelize.INTEGER
      },
      deliveryFees: {
        type: Sequelize.INTEGER
      },
      deliveryAddress: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.INTEGER
      },
      failedStatus: {
        type: Sequelize.INTEGER
      },
      penalty: {
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
      refundedAmount: {
        type: Sequelize.INTEGER
      },
      kegsDeliveredQty: {
        type: Sequelize.INTEGER
      },
      tapsDeliveredQty: {
        type: Sequelize.INTEGER
      },
      kegsReturnedQty: {
        type: Sequelize.INTEGER
      },
      tapsReturnedQty: {
        type: Sequelize.INTEGER
      },
      customerId: {
        type: Sequelize.INTEGER
      },
      storeId: {
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
    return queryInterface.dropTable('Orders');
  }
};