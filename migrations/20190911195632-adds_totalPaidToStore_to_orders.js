"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "Orders",
      "totalPaidToStore",
      Sequelize.INTEGER
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Orders", "totalPaidToStore");
  }
};
