"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn("Products", "storeId")]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Products", "storeId", {
        type: Sequelize.INTEGER
      })
    ]);
  }
};
