const Sequelize = require("sequelize");

const sequelize = require("../../config/database");

const tableName = "Cart";

const hooks = {
  beforeCreate(cart) {}
};

const Cart = sequelize.define(
  "Cart",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    hastap: {
      type: Sequelize.BOOLEAN
    },
    quantity: {
      type: Sequelize.DOUBLE
    },
    price: {
      type: Sequelize.DOUBLE
    },
    customerId: {
      type: Sequelize.INTEGER
    },
    inventoryId: {
      type: Sequelize.INTEGER
    },
    deleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  },
  { hooks, tableName }
);

Cart.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Cart;
