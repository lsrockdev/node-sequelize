"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Orders", "stripeLast4", {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn("Orders", "stripePaymentAmount", {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn("Orders", "stripeCardType", {
      type: Sequelize.STRING
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Orders", "stripeLast4");
    await queryInterface.removeColumn("Orders", "stripePaymentAmount");
    await queryInterface.removeColumn("Orders", "stripeCardType");
  }
};
