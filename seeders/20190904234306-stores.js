"use strict";

const stores = [
  {
    name: "Seaport Wine and Liquors",
    isActive: true,
    numberOfDays: 0,
    uid: "FRTPSTR5017",
    createdAt: new Date(),
    updatedAt: new Date(),
    address: JSON.stringify({
      address1: "407 D St",
      city: "Boston",
      state: "MA",
      zipCode: "02210"
    })
  },
  {
    name: "O'Brien's Package Store",
    isActive: true,
    numberOfDays: 0,
    uid: "FRTPSTR5016",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "TD BANK/ SUBWAY PLAZA ",
    address: JSON.stringify({
      address1: " 420 Franklin St",
      city: "Framingham",
      state: "MA",
      zipCode: "01702"
    })
  },
  {
    name: "Sunoco Brookline",
    isActive: true,
    numberOfDays: 0,
    uid: "FRTPSTR5013",
    createdAt: new Date(),
    updatedAt: new Date(),
    address: JSON.stringify({
      address1: "454 Harvard St",
      city: "Brookline",
      state: "MA",
      zipCode: "02446"
    })
  },
  {
    name: "Burton's Newton Corner",
    isActive: true,
    numberOfDays: 0,
    uid: "FRTPSTR5012",
    createdAt: new Date(),
    updatedAt: new Date(),
    address: JSON.stringify({
      address1: "355 Washington St",
      city: "Newton",
      state: "MA",
      zipCode: "02458"
    })
  }
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Stores", stores, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
