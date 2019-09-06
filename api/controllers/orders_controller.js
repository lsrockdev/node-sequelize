const getCurrentUser = require("../helpers/current_user_helper");
const db = require("../services/db.service.js");

const OrdersController = () => {
  const placeOrder = async (req, res) => {
    // const { body } = req.body;
    // const customerId = req.token.id;
    // const currentUser = await getCurrentUser("db.Customer", customerId);
    return res.status(200).json({
      Message: "testing",
      StatusCode: 1
    });
  };

  const getAll = async (req, res) => {
    const customerId = req.token.id;

    try {
      const orders = await db.Order.findAll({
        where: {
          customerId
        },
        include: [db.LineItem]
      });
      return res.status(200).json({
        orders,
        message: "Successfully returned Orders",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  const getOne = async (req, res) => {
    const customerId = req.token.id;
    const { id } = req.body;

    try {
      const order = await db.Order.findOne({
        where: {
          customerId,
          id
        },
        include: [db.LineItem]
      });
      return res.status(200).json({
        order,
        message: "Successfully returned Order",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  return { placeOrder, getAll, getOne };
};

module.exports = OrdersController;
