const Cart = require("../../models").Cart;
const Customer = require("../../models").Customer;
const Inventory = require("../../models").Inventory;
const Store = require("../../models").Store;

const CartController = () => {
  const getAll = async (req, res) => {
    try {
      Inventory.hasMany(Cart, { foreignKey: "inventoryId" });
      Cart.belongsTo(Inventory, { foreignKey: "inventoryId" });
      const carts = await Cart.findAll({
        where: {
          deleted: false || null
        },
        include: [Inventory]
      });
      return res.status(200).json({
        carts,
        message: "Cart Added Succesfully",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

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
      await Cart.update({ deleted: 1 }, { where: { id: cartId } });
      return res.status(200).json({
        message: "Cart Deleted Succesfully",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  const deleteByCustomerId = async (req, res) => {
    const customerId = req.token.id;
    try {
      await Cart.update({ deleted: 1 }, { where: { customerId } });
      return res.status(200).json({
        message: "Cart Deleted Succesfully",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  const getCartById = async id => {
    try {
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

  const getCartByCustomer = async customerId => {
    try {
      Customer.hasMany(Cart, { foreignKey: "customerId" });
      Cart.belongsTo(Customer, { foreignKey: "customerId" });
      Store.hasOne(Inventory, { foreignKey: "storeId" });
      Inventory.belongsTo(Store, { foreignKey: "storeId" });

      const carts = await Cart.findAll({
        where: {
          customerId: customerId
        },
        include: [
          Customer,
          {
            model: Inventory,
            include: [
              {
                model: Store
              }
            ]
          }
        ]
      });
      return carts;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const getActiveStore = async customerId => {
    const carts = await getCartByCustomer(id);
    const activeCarts = carts.filter(
      cart =>
        cart.Inventory &&
        cart.Inventory.Store &&
        !cart.Inventory.Store.IsFrattapStore
    );
    if (activeCarts.length > 0) {
      return activeCarts[0].Inventory.Store;
    }
    return null;
  };

  return {
    getAll,
    addOne,
    deleteOne,
    deleteByCustomerId,
    getActiveStore
  };
};

module.exports = CartController;
