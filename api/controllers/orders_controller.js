const getCurrentUser = require("../helpers/current_user_helper");
const db = require("../services/db.service.js");

const OrdersController = () => {
  const placeOrder = async (req, res) => {
    const { body } = req;
    const customerId = req.token.id;
    // const currentUser = await getCurrentUser("db.Customer", customerId);

    try {
      order = await db.Order.create({
        storeId: body.storeId
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
    // loop through each inventory and add - make sure store id matches order
    // add up delivery fees
    // add tip
    // add tax (zero currently now)
    // total order
    // take address id and expand it to order
    // placeholder for noOfReturnDays
    // placeholder for slotStart
    // placeholder for nonce

    return res.status(200).json({
      Message: "Order successfully created",
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
