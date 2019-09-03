"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn(
          "Orders",
          "billingAddress",
          {
            type: Sequelize.STRING
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "Orders",
          "paymentCompleted",
          {
            type: Sequelize.BOOLEAN
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "Orders",
          "stripeToken",
          {
            type: Sequelize.STRING
          },
          { transaction: t }
        )
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn("Orders", "billingAddress", {
          transaction: t
        }),
        queryInterface.removeColumn("Orders", "paymentCompleted", {
          transaction: t
        }),
        queryInterface.removeColumn("Orders", "stripeToken", {
          transaction: t
        })
      ]);
    });
  }
};
