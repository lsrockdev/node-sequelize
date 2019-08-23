const Sequelize = require("sequelize");

const sequelize = require("../../config/database");

const tableName = "Inventory";

const hooks = {
  beforeCreate(inventory) {}
};

const Inventory = sequelize.define(
  "Inventory",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING
    },
    cost: {
      type: Sequelize.DOUBLE
    },
    quantity: {
      type: Sequelize.INTEGER
    },
    description: {
      type: Sequelize.STRING
    },
    depositeFee: {
      type: Sequelize.DOUBLE
    },
    deliveryFee: {
      type: Sequelize.DOUBLE
    },
    createdBy: {
      type: Sequelize.INTEGER
    },
    modifiedBy: {
      type: Sequelize.INTEGER
    },
    isActive: {
      type: Sequelize.BOOLEAN
    },
    isDeleted: {
      type: Sequelize.BOOLEAN
    },
    categorySizeId: {
      type: Sequelize.INTEGER
    },
    productId: {
      type: Sequelize.INTEGER
    },
    storeId: {
      type: Sequelize.INTEGER
    },
    categoryId: {
      type: Sequelize.INTEGER
    },
    storeTapId: {
      type: Sequelize.INTEGER
    },
    kegtypeId: {
      type: Sequelize.INTEGER
    }
  },
  { hooks, tableName }
);

Inventory.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Inventory;
