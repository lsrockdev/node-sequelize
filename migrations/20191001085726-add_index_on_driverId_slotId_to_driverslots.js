'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex(
      'driverSlots',
      ['driverId', 'slotId'],
      { type: 'UNIQUE' }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex(
      'driverSlots',
      ['driverId', 'slotId']
    );
  }
};
