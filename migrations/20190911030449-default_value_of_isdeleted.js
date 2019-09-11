"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Categories", "isDeleted", {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    await queryInterface.changeColumn("Inventories", "isDeleted", {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    await queryInterface.changeColumn("Products", "isDeleted", {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    await queryInterface.changeColumn("Sizes", "isDeleted", {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    await queryInterface.changeColumn("StoreUsers", "isDeleted", {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    await queryInterface.changeColumn("StoreUsers", "isDeleted", {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },

  down: (queryInterface, Sequelize) => {
    return Promise.resolve(true);
  }
};
