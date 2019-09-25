"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Inventories", "categorySizeId");
    await queryInterface.addColumn("Inventories", "sizeId", Sequelize.INTEGER);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "Inventories",
      "categorySizeId",
      Sequelize.INTEGER
    );
    await queryInterface.removeColumn("Inventories", "sizeId");
  }
};
