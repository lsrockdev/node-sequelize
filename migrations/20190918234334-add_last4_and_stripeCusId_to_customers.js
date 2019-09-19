"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Customers", "stripeLast4", {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn("Customers", "stripeCusId", {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn("Customers", "stripeCardType", {
      type: Sequelize.STRING
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Customers", "stripeLast4");
    await queryInterface.removeColumn("Customers", "stripeCusId");
    await queryInterface.removeColumn("Customers", "stripeCardType");
  }
};
