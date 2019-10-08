"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex("DriverSlots", ["driverId", "slotId"], {
      type: "UNIQUE"
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex("DriverSlots", ["driverId", "slotId"]);
  }
};
