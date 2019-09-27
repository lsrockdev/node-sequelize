"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Slots", "isMaxedOut", {
      type: Sequelize.BOOLEAN
    });
    await queryInterface.addColumn("Slots", "maxDeliveriesAllowed", {
      type: Sequelize.INTEGER
    });
    await queryInterface.addColumn("Slots", "isSelectable", {
      type: Sequelize.BOOLEAN
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Slots", "isMaxedOut");
    await queryInterface.removeColumn("Slots", "maxDeliveriesAllowed");
    await queryInterface.removeColumn("Slots", "isSelectable");
  }
};
