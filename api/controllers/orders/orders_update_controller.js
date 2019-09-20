const Sequelize = require("sequelize");
const db = require("../../../api/services/db.service");
const OrderStatus = require("../../constant/enum").OrderStatus;

const OrderUpdateController = () => {
  // customer app
  const claimOrderforDeliver = async (req, res) => {
    const body = req.body;
    try {
      const order = await updateOne(body.orderId, {
        status: OrderStatus.ClaimDeliver,
        deliveredBy: body.driverId
      });
      return res.status(200).json({
        order: order,
        message: "Update Successfull",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const claimOrderforPickup = async (req, res) => {
    const body = req.body;
    try {
      const order = await updateOne(body.orderId, {
        status: OrderStatus.ClaimPickUp,
        returnedBy: body.driverId
      });
      return res.status(200).json({
        order: order,
        message: "Update Successfull",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const declainOrder = async (req, res) => {
    const body = req.body;
    try {
      const order = await updateOne(body.orderId, {
        status: OrderStatus.Declain
      });
      return res.status(200).json({
        order: order,
        message: "Update Successfull",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const deliveredOrder = async (req, res) => {
    const body = req.body;
    try {
      const order = await updateOne(body.orderId, {
        status: OrderStatus.Delivered,
        deliveredBy: body.driverId,
        deliveredAt: Date.now()
      });
      return res.status(200).json({
        order: order,
        message: "Update Successfull",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const deliverFailed = async (req, res) => {
    const body = req.body;
    try {
      const order = await updateOne(body.orderId, {
        status: OrderStatus.DeliverFailed,
        deliveredBy: body.driverId,
        deliveredAt: Date.now()
      });
      return res.status(200).json({
        order: order,
        message: "Update Successfull",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const pickUpOrder = async (req, res) => {
    const body = req.body;
    try {
      const order = await updateOne(body.orderId, {
        status: OrderStatus.Pickup
      });
      return res.status(200).json({
        order: order,
        message: "Update Successfull",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const pickUpFailed = async (req, res) => {
    const body = req.body;
    try {
      const order = await updateOne(body.orderId, {
        status: OrderStatus.PickupFailed,
        returnedBy: body.driverId,
        returnedAt: Date.now()
      });
      return res.status(200).json({
        order: order,
        message: "Update Successfull",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const updateOne = async (id, data) => {
    try {
      const order = await db.Order.findOne({
        where: { id }
      });
      await order.update(data);
      return order;
    } catch (err) {
      console.log(err);
      throw new Error("Internal server error");
    }
  };

  return {
    claimOrderforDeliver,
    claimOrderforPickup,
    declainOrder,
    deliveredOrder,
    deliverFailed,
    pickUpOrder,
    pickUpFailed
  };
};

module.exports = OrderUpdateController;
