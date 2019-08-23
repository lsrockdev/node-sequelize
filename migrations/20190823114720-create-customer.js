'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      userName: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.JSON
      },
      isActive: {
        type: Sequelize.BOOLEAN
      },
      lastLogin: {
        type: Sequelize.DATE
      },
      gender: {
        type: Sequelize.INTEGER
      },
      isFbUser: {
        type: Sequelize.BOOLEAN
      },
      secondaryContact: {
        type: Sequelize.STRING
      },
      secondaryContactName: {
        type: Sequelize.STRING
      },
      stateId: {
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Customers');
  }
};