"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Products", "description");
    await queryInterface.addColumn("Products", "description", Sequelize.TEXT);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Products", "description");
    await queryInterface.addColumn("Products", "description", Sequelize.STRING);
  }
};
