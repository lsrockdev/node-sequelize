"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("CatergorySizes");
    await queryInterface.createTable("CategorySizes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      sizeId: {
        type: Sequelize.INTEGER
      },
      categoryId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("CategorySizes");
    await queryInterface.createTable("CatergorySizes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      isDeleted: {
        type: Sequelize.BOOLEAN
      },
      sizeId: {
        type: Sequelize.INTEGER
      },
      categoryId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  }
};
