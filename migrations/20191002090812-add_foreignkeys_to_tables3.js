"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.addIndex("StoreCodes", ["code"], { type: "UNIQUE" });
    // await queryInterface.changeColumn("Stores", "uid", {
    //   type: Sequelize.INTEGER,
    //   references: {
    //     model: "StoreCodes", // name of Target model
    //     key: "code" // key in Target model that we're referencing
    //   },
    //   onUpdate: "CASCADE",
    //   onDelete: "SET NULL"
    // });
    // await queryInterface.changeColumn("LineItems", "inventoryId", {
    //   type: Sequelize.INTEGER,
    //   references: {
    //     model: "Inventories", // name of Target model
    //     key: "id" // key in Target model that we're referencing
    //   },
    //   onUpdate: "CASCADE",
    //   onDelete: "SET NULL"
    // });
    return true;
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.removeIndex("StoreCodes", ["code"]);
    return true;
  }
};
