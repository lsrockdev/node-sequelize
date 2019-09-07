"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Inventories", "depositeFee"),
      queryInterface.removeColumn("Inventories", "cost"),
      queryInterface.removeColumn("Inventories", "deliveryFee")
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Inventories", "depositeFee", {
        type: Sequelize.DOUBLE
      }),
      queryInterface.addColumn("Inventories", "cost", {
        type: Sequelize.DOUBLE
      }),
      queryInterface.addColumn("Inventories", "deliveryFee", {
        type: Sequelize.DOUBLE
      })
    ]);
  }
};
