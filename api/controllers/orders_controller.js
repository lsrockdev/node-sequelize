const getCurrentUser = require("../helpers/current_user_helper");
const Order = require("../../models").Order;
const LineItem = require("../../models").LineItem;

const OrdersController = () => {
  const placeOrder = async (req, res) => {
    // const { body } = req.body;
    // const customerId = req.token.id;
    // const currentUser = await getCurrentUser("Customer", customerId);
    return res.status(200).json({
      Message: "testing",
      StatusCode: 1
    });
  };

  const getAll = async (req, res) => {
    const customerId = req.token.id;

    try {
      const orders = await Order.findAll({
        where: {
          customerId
        },
        include: [LineItem]
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

  return { placeOrder, getAll };
};

module.exports = OrdersController;
