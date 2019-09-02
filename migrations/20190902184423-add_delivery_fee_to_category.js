"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      "Categories",
      "deliveryFee",
      Sequelize.INTEGER
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Categories", "deliveryFee");
  }
};
