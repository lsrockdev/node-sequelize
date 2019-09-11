"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Customers", "address");
    await queryInterface.removeColumn("Carts", "deleted");
    await queryInterface.addColumn("Carts", "isDeleted", {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Customers", "address", Sequelize.TEXT);
    await queryInterface.addColumn("Carts", "deleted", {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    await queryInterface.removeColumn("Carts", "isDeleted");
    await queryInterface.changeColumn("Categories", "isDeleted", {
      type: Sequelize.BOOLEAN,
      defaultValue: null
    });
  }
};
