const Cart = require("../../models").Cart;
const Customer = require("../../models").Customer;
const Inventory = require("../../models").Inventory;
const Store = require("../../models").Store;
const Product = require("../../models").Product;

const CartController = () => {
  const getAll = async (req, res) => {
    try {
      const carts = await Cart.findAll({
        where: {
          isDeleted: false
        },
        include: [
          {
            model: Inventory,
            include: [
              {
                model: Store,
              },
              {
                model: Product,
              },
            ],
          },
        ],
      });
      return res.status(200).json({
        carts,
        message: "success",
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
      body.customerId = req.token.id;
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
      await Cart.update({ isDeleted: 1 }, { where: { id: cartId } });
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
      await Cart.update({ isDeleted: 1 }, { where: { customerId } });
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
      let cart = await Cart.findOne({
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
