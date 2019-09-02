"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn(
          "Products",
          "isKeg",
          {
            type: Sequelize.BOOLEAN
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "Products",
          "depositFee",
          {
            type: Sequelize.INTEGER
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "Products",
          "deliveryFee",
          {
            type: Sequelize.INTEGER
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "Products",
          "price",
          {
            type: Sequelize.INTEGER
          },
          { transaction: t }
        )
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn("Products", "isKeg", { transaction: t }),
        queryInterface.removeColumn("Products", "depositFee", {
          transaction: t
        }),
        queryInterface.removeColumn("Products", "deliveryFee", {
          transaction: t
        }),
        queryInterface.removeColumn("Products", "price", { transaction: t })
      ]);
    });
  }
};
