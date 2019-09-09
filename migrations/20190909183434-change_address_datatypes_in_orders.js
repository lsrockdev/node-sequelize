"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Orders", "deliveryAddress");
    await queryInterface.removeColumn("Orders", "billingAddress");
    await queryInterface.addColumn("Orders", "deliveryAddress", Sequelize.TEXT);
    await queryInterface.addColumn("Orders", "billingAddress", Sequelize.TEXT);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Orders", "deliveryAddress");
    await queryInterface.removeColumn("Orders", "billingAddress");
    await queryInterface.addColumn(
      "Orders",
      "deliveryAddress",
      Sequelize.STRING
    );
    await queryInterface.addColumn(
      "Orders",
      "billingAddress",
      Sequelize.STRING
    );
  }
};
