"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Inventories", "description");
    await queryInterface.addColumn(
      "Inventories",
      "description",
      Sequelize.TEXT
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Inventories", "description");
    await queryInterface.addColumn(
      "Inventories",
      "description",
      Sequelize.STRING
    );
  }
};
