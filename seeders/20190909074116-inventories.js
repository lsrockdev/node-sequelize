"use strict";

// Change the storeId's if they aren't 1,2,3, and 4
// Change the productId's if they aren't 1,2,3, and 4

const inventories = [
  {
    name: "Allen's Triple Sec",
    isActive: true,
    isDeleted: false,
    description:
      "Remarkable fresh flavors of this triple sec makes it the perfect mixer for your favorite drink recipes. Each of Allen\u0027s liqueurs and schnapps burst with the rich taste and aromas found in products costing twice as much.",
    storeId: 1,
    categoryId: 1,
    productId: 1,
    price: 400,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Kura The Whisky",
    isActive: true,
    isDeleted: false,
    description:
      "A variation of Kura The Whisky blended malt whisky, which has enjoyed a finishing period in casks that previously held rum. We\u0027re rather fold of rum cask finished whiskies, as they help to bolster any lip-smacking fruit notes - and that\u0027s exactly what has happened here.\r\n\r\nNose: Toasted oak to the fore, before a kick of green apple and spiced mango chutney.\r\n\r\nPalate: Tangy orange and lemon, followed by a touch of menthol. Still quite smoky.\r\n\r\nFinish: Burnt sugar, stewed pears and heavy hints of clove.",
    storeId: 1,
    categoryId: 2,
    productId: 2,
    price: 2000,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Laddy's Irish Country Cream",
    isActive: true,
    isDeleted: false,
    description:
      "A delicious Irish cream liqueur. Try it in your coffee, if you\u0027re an alcohol-in-the-morning kind of person. ",
    storeId: 1,
    categoryId: 3,
    productId: 3,
    price: 2200,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Laphroaig 10 Year Old Scotch Whisky",
    isActive: true,
    isDeleted: false,
    description:
      "An all-malt Scotch whisky, malted barley is dried over a peat fire for a unique full, rich flavor. Aroma and flavors are of blue peat smoke, the sweet nuttiness of the barley, the delicate heathery perfume of Islay\u0027s streams.",
    storeId: 2,
    categoryId: 1,
    productId: 4,
    price: 5000,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Laphroaig 25 Year Old Scotch Whisky",
    isActive: true,
    isDeleted: false,
    description:
      "Matured in second-fill Oloroso Sherry casks and American oak ex-bourbon barrels for 25 years(!), a well-aged release of this incredibly popular heavily-peated single malt from Islay. Laphroaig aged for quarter of a century and bottled, without chill filtration, at 48.9% ABV.",
    storeId: 2,
    categoryId: 2,
    productId: 5,
    price: 3000,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Knob Creek Straight Rye Whiskey",
    isActive: true,
    isDeleted: false,
    description:
      "Color: Shades of gold to light amber.\r\nTaste: Bold rye spiciness with undertones of vanilla and oak.\r\nAroma: Expansive notes of herbs and rye with nuances of oak.\r\nFinish: Warm and smooth with spice throughout.\r\n",
    storeId: 2,
    categoryId: 3,
    productId: 6,
    price: 2500,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Inventories", inventories, {});
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
