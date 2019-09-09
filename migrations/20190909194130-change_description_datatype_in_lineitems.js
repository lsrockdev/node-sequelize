"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("LineItems", "description");
    await queryInterface.addColumn("LineItems", "description", Sequelize.TEXT);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("LineItems", "description");
    await queryInterface.addColumn(
      "LineItems",
      "description",
      Sequelize.STRING
    );
  }
};
