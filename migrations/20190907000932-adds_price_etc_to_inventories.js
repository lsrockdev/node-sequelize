"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Inventories", "isKeg", {
        type: Sequelize.BOOLEAN
      }),
      queryInterface.addColumn("Inventories", "price", {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn("Inventories", "depositFee", {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn("Inventories", "deliveryFee", {
        type: Sequelize.INTEGER
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Inventories", "isKeg"),
      queryInterface.removeColumn("Inventories", "price"),
      queryInterface.removeColumn("Inventories", "depositFee"),
      queryInterface.removeColumn("Inventories", "deliveryFee")
    ]);
  }
};
