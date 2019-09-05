"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Categories",
      [
        {
          name: "Beer",
          description: null,
          isActive: true,
          catgUrlImagePath:
            "https://tapsterprod.blob.core.windows.net/categories/99a47750-97ec-4177-b759-93667b86cd29",
          isDeleted: false,
          imageGuid: "99a47750-97ec-4177-b759-93667b86cd29",
          isForFrattapStore: false,
          isMaster: false,
          deliveryFee: 300,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "White Wine",
          description: "White Wine",
          isActive: true,
          catgUrlImagePath:
            "https://tapsterprod.blob.core.windows.net/categories/6c0f554e-86f6-426e-af13-c9142bd052a0",
          isDeleted: false,
          imageGuid: "6c0f554e-86f6-426e-af13-c9142bd052a0",
          isForFrattapStore: false,
          isMaster: false,
          deliveryFee: 400,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Vodka",
          description: "Vodka",
          isActive: true,
          catgUrlImagePath:
            "https://tapsterprod.blob.core.windows.net/categories/2e820616-d91a-4e25-8362-5557f6b26ead",
          isDeleted: false,
          imageGuid: "2e820616-d91a-4e25-8362-5557f6b26ead",
          isForFrattapStore: false,
          isMaster: false,
          deliveryFee: 300,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Large Keg",
          description: "Large Kegs",
          isActive: true,
          catgUrlImagePath:
            "https://tapsterprod.blob.core.windows.net/categories/7600fc6f-6844-46b0-b23a-e7e9c180cca4",
          isDeleted: false,
          imageGuid: "7600fc6f-6844-46b0-b23a-e7e9c180cca4",
          isForFrattapStore: false,
          isMaster: true,
          deliveryFee: 3000,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Small Keg",
          description: "Small Kegs",
          isActive: true,
          catgUrlImagePath:
            "https://tapsterprod.blob.core.windows.net/categories/bac7d620-33c5-4022-ba57-7cc8a65892b8",
          isDeleted: false,
          imageGuid: "bac7d620-33c5-4022-ba57-7cc8a65892b8",
          isForFrattapStore: false,
          isMaster: true,
          deliveryFee: 2500,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Party Packages",
          description: "Party Packages",
          isActive: true,
          catgUrlImagePath:
            "https://tapsterprod.blob.core.windows.net/categories/7600fc6f-6844-46b0-b23a-e7e9c180cca6",
          isDeleted: false,
          imageGuid: "7600fc6f-6844-46b0-b23a-e7e9c180cca6",
          isForFrattapStore: false,
          isMaster: true,
          deliveryFee: 5000,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Mixers and More",
          description: null,
          isActive: true,
          catgUrlImagePath:
            "https://tapsterprod.blob.core.windows.net/categories/c025e429-0bb5-4519-a6fc-212135abcf6c",
          isDeleted: false,
          imageGuid: "c025e429-0bb5-4519-a6fc-212135abcf6c",
          isForFrattapStore: false,
          isMaster: false,
          deliveryFee: 100,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Snacks",
          description: null,
          isActive: true,
          catgUrlImagePath:
            "https://tapsterprod.blob.core.windows.net/categories/aa02de09-4fbc-4e14-9c1e-86dfdac7fc0c",
          isDeleted: false,
          imageGuid: "aa02de09-4fbc-4e14-9c1e-86dfdac7fc0c",
          isForFrattapStore: false,
          isMaster: false,
          deliveryFee: 75,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Tapster Favorites",
          description: null,
          isActive: true,
          catgUrlImagePath:
            "https://tapsterprod.blob.core.windows.net/categories/adc92e77-25aa-4b41-9df4-3c1cc32462ad",
          isDeleted: false,
          imageGuid: "adc92e77-25aa-4b41-9df4-3c1cc32462ad",
          isForFrattapStore: false,
          isMaster: false,
          deliveryFee: 200,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Sake and Soju",
          description: null,
          isActive: true,
          catgUrlImagePath:
            "https://tapsterprod.blob.core.windows.net/categories/df7dda64-126e-4793-82e5-59bebda042a4",
          isDeleted: false,
          imageGuid: "df7dda64-126e-4793-82e5-59bebda042a4",
          isForFrattapStore: false,
          isMaster: false,
          deliveryFee: 400,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
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
