"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Driver", "code", {
      type: Sequelize.TEXT
    });
    await queryInterface.addColumn("Driver", "otpCode", {
      type: Sequelize.TEXT
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Driver", "code");
    await queryInterface.removeColumn("Driver", "otpCode");
  }
};
