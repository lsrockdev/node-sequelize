"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // try {
    //   await queryInterface.changeColumn("Carts", "customerId", {
    //     type: Sequelize.INTEGER,
    //     references: {
    //       model: "Customers", // name of Target model
    //       key: "id" // key in Target model that we're referencing
    //     },
    //     onUpdate: "CASCADE",
    //     onDelete: "SET NULL"
    //   });
    //   await queryInterface.changeColumn("Carts", "inventoryId", {
    //     type: Sequelize.INTEGER,
    //     references: {
    //       model: "Inventories", // name of Target model
    //       key: "id" // key in Target model that we're referencing
    //     },
    //     onUpdate: "CASCADE",
    //     onDelete: "SET NULL"
    //   });
    //   //CategorySizes table
    //   await queryInterface.changeColumn("CategorySizes", "sizeId", {
    //     type: Sequelize.INTEGER,
    //     references: {
    //       model: "Sizes", // name of Target model
    //       key: "id" // key in Target model that we're referencing
    //     },
    //     onUpdate: "CASCADE",
    //     onDelete: "SET NULL"
    //   });
    //   await queryInterface.changeColumn("CategorySizes", "categoryId", {
    //     type: Sequelize.INTEGER,
    //     references: {
    //       model: "Categories", // name of Target model
    //       key: "id" // key in Target model that we're referencing
    //     },
    //     onUpdate: "CASCADE",
    //     onDelete: "SET NULL"
    //   });
    //   //DriverSlots table
    //   await queryInterface.changeColumn("DriverSlots", "driverId", {
    //     type: Sequelize.INTEGER,
    //     references: {
    //       model: "Drivers", // name of Target model
    //       key: "id" // key in Target model that we're referencing
    //     },
    //     onUpdate: "CASCADE",
    //     onDelete: "SET NULL"
    //   });
    //   await queryInterface.changeColumn("DriverSlots", "slotId", {
    //     type: Sequelize.INTEGER,
    //     references: {
    //       model: "Slots", // name of Target model
    //       key: "id" // key in Target model that we're referencing
    //     },
    //     onUpdate: "CASCADE",
    //     onDelete: "SET NULL"
    //   });
    //   //Favorites table
    //   await queryInterface.changeColumn("Favorites", "productId", {
    //     type: Sequelize.INTEGER,
    //     references: {
    //       model: "Products", // name of Target model
    //       key: "id" // key in Target model that we're referencing
    //     },
    //     onUpdate: "CASCADE",
    //     onDelete: "SET NULL"
    //   });
    //   await queryInterface.changeColumn("Favorites", "customerId", {
    //     type: Sequelize.INTEGER,
    //     references: {
    //       model: "Customers", // name of Target model
    //       key: "id" // key in Target model that we're referencing
    //     },
    //     onUpdate: "CASCADE",
    //     onDelete: "SET NULL"
    //   });
    //   //Inventory table
    //   await queryInterface.changeColumn("Inventories", "productId", {
    //     type: Sequelize.INTEGER,
    //     references: {
    //       model: "Products", // name of Target model
    //       key: "id" // key in Target model that we're referencing
    //     },
    //     onUpdate: "CASCADE",
    //     onDelete: "SET NULL"
    //   });
    //   await queryInterface.changeColumn("Inventories", "sizeId", {
    //     type: Sequelize.INTEGER,
    //     references: {
    //       model: "Sizes", // name of Target model
    //       key: "id" // key in Target model that we're referencing
    //     },
    //     onUpdate: "CASCADE",
    //     onDelete: "SET NULL"
    //   });
    //   await queryInterface.changeColumn("Inventories", "categoryId", {
    //     type: Sequelize.INTEGER,
    //     references: {
    //       model: "Categories", // name of Target model
    //       key: "id" // key in Target model that we're referencing
    //     },
    //     onUpdate: "CASCADE",
    //     onDelete: "SET NULL"
    //   });
    //   await queryInterface.changeColumn("Inventories", "storeId", {
    //     type: Sequelize.INTEGER,
    //     references: {
    //       model: "Stores", // name of Target model
    //       key: "id" // key in Target model that we're referencing
    //     },
    //     onUpdate: "CASCADE",
    //     onDelete: "SET NULL"
    //   });
    //   //LineItem table
    //   await queryInterface.changeColumn("LineItems", "orderId", {
    //     type: Sequelize.INTEGER,
    //     references: {
    //       model: "Orders", // name of Target model
    //       key: "id" // key in Target model that we're referencing
    //     },
    //     onUpdate: "CASCADE",
    //     onDelete: "SET NULL"
    //   });
    //   await queryInterface.changeColumn("LineItems", "productId", {
    //     type: Sequelize.INTEGER,
    //     references: {
    //       model: "Products", // name of Target model
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
