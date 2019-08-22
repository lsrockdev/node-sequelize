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
    Quantity: {
      type: Sequelize.DOUBLE
    },
    Price: {
      type: Sequelize.DOUBLE
    },
    CustomerId: {
      type: Sequelize.INTEGER
    },
    InventoryId: {
      type: Sequelize.INTEGER
    }
  },
  { hooks, tableName }
);

Cart.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

module.exports = Cart;
