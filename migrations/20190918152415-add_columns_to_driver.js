"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Drivers", "code", {
      type: Sequelize.TEXT
    });
    await queryInterface.addColumn("Drivers", "otpCode", {
      type: Sequelize.TEXT
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Drivers", "code");
    await queryInterface.removeColumn("Drivers", "otpCode");
  }
};
