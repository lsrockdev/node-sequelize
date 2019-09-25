"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "Orders",
      "stripeProcessingFees",
      Sequelize.INTEGER
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Orders", "stripeProcessingFees");
  }
};
