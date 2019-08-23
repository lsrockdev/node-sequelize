const Cart = require("../models/cart");
const Inventory = require("../models/inventory");
const Customer = require("../models/customer");

const CartController = () => {
  const getAll = async (req, res) => {};

  const addOne = async (req, res) => {
    const { body } = req;
    try {
      const cart = await Cart.create(body);
      const cartDetail = await getCartById(cart.id);
      return res.status(200).json({
        cart: cartDetail,
        message: "Cart Added Succesfully",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  const deleteOne = async (req, res) => {
    const { cartId } = req.body;
    try {
      const cart = await Cart.findOne({
        where: {
          id: cartId
        }
      });
      await cart.update({ deleted: 1 });
      return res.status(200).json({
        message: "Cart Deleted Succesfully"
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  const getCartById = async id => {
    try {
      Customer.hasMany(Cart, { foreignKey: "customerId" });
      Inventory.hasMany(Cart, { foreignKey: "inventoryId" });

      Cart.belongsTo(Customer, { foreignKey: "customerId" });
      Cart.belongsTo(Inventory, { foreignKey: "inventoryId" });

      const cart = await Cart.findOne({
        where: {
          id: id
        },
        include: [Customer, Inventory]
      });
      return cart;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  return {
    getAll,
    addOne,
    deleteOne
  };
};

module.exports = CartController;
