"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Favorites", "productName");
    await queryInterface.addColumn("Favorites", "productId", Sequelize.INTEGER);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Favorites", "productName", Sequelize.TEXT);
    await queryInterface.removeColumn("Favorites", "productId");
  }
};
