"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // try {
    //Order table
    //   await queryInterface.changeColumn("Orders", "customerId", {
    //     type: Sequelize.INTEGER,
    //     references: {
    //       model: "Customers", // name of Target model
    //       key: "id" // key in Target model that we're referencing
    //     },
    //     onUpdate: "CASCADE",
    //     onDelete: "SET NULL"
    //   });
    //   await queryInterface.changeColumn("Orders", "storeId", {
    //     type: Sequelize.INTEGER,
    //     references: {
    //       model: "Stores", // name of Target model
    //       key: "id" // key in Target model that we're referencing
    //     },
    //     onUpdate: "CASCADE",
    //     onDelete: "SET NULL"
    //   });
    //   await queryInterface.changeColumn("Orders", "deliveredBy", {
    //     type: Sequelize.INTEGER,
    //     references: {
    //       model: "Drivers", // name of Target model
    //       key: "id" // key in Target model that we're referencing
    //     },
    //     onUpdate: "CASCADE",
    //     onDelete: "SET NULL"
    //   });
    //   await queryInterface.changeColumn("Orders", "slotId", {
    //     type: Sequelize.INTEGER,
    //     references: {
    //       model: "Slots", // name of Target model
    //       key: "id" // key in Target model that we're referencing
    //     },
    //     onUpdate: "CASCADE",
    //     onDelete: "SET NULL"
    //   });
    //   // Products table
    //   await queryInterface.changeColumn("Products", "categoryId", {
    //     type: Sequelize.INTEGER,
    //     references: {
    //       model: "Categories", // name of Target model
    //       key: "id" // key in Target model that we're referencing
    //     },
    //     onUpdate: "CASCADE",
    //     onDelete: "SET NULL"
    //   });
    //   //Stores table
    //   await queryInterface.changeColumn("Stores", "userId", {
    //     type: Sequelize.INTEGER,
    //     references: {
    //       model: "StoreUsers", // name of Target model
    //       key: "id" // key in Target model that we're referencing
    //     },
    //     onUpdate: "CASCADE",
    //     onDelete: "SET NULL"
    //   });
    // } catch (err) {
    //   console.log(err);
    //   return false;
    // }
    return true;
  },

  down: async (queryInterface, Sequelize) => {
    return true;
  }
};
