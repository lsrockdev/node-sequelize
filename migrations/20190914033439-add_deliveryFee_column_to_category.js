"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "Categories",
      "deliveryFee",
      Sequelize.INTEGER
    );
    await queryInterface.removeColumn("Products", "deliveryFee");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Categories", "deliveryFee");
    await queryInterface.addColumn(
      "Products",
      "deliveryFee",
      Sequelize.INTEGER
    );
  }
};
