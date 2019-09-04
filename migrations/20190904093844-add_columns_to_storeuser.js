"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("StoreUsers", "isDeleted", {
        type: Sequelize.BOOLEAN
      }),
      queryInterface.addColumn("StoreUsers", "isRegistered", {
        type: Sequelize.BOOLEAN
      }),
      queryInterface.addColumn("StoreUsers", "roleId", {
        type: Sequelize.INTEGER
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("StoreUsers", "isDeleted"),
      queryInterface.removeColumn("StoreUsers", "isRegistered"),
      queryInterface.removeColumn("StoreUsers", "roleId")
    ]);
  }
};
