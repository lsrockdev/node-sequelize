const Sequelize = require("sequelize");
const db = require("../../../api/services/db.service");
const OrderStatus = require("../../constant/enum").OrderStatus;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const OrderUpdateController = () => {
  const schedulePickUp = async (req, res) => {
    const body = req.body;
    try {
      const slot = await db.Slot.findOne({
        where: { id: body.slotId }
      });
      if (slot.isMaxedOut || !slot.isSelectable) {
        return res.status(401).json({ message: "Unavailable Slot" });
      }
      const order = await updateOne(body.orderId, {
        pickupAt: slot.start
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

  const claimOrderforDeliver = async (req, res) => {
    const driverId = req.token.id;
    const body = req.body;
    try {
      const order = await updateOne(body.orderId, {
        status: OrderStatus.ClaimDeliver,
        deliveredBy: driverId
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
    const driverId = req.token.id;
    const body = req.body;
    try {
      const order = await updateOne(body.orderId, {
        status: OrderStatus.ClaimPickUp,
        returnedBy: driverId
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

  const declaimOrder = async (req, res) => {
    const body = req.body;
    try {
      const order = await updateOne(body.orderId, {
        status: OrderStatus.Declaim
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
    const driverId = req.token.id;
    const body = req.body;
    try {
      const order = await updateOne(body.orderId, {
        status: OrderStatus.Delivered,
        deliveredBy: driverId,
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
    const driverId = req.token.id;
    const body = req.body;
    try {
      const order = await updateOne(body.orderId, {
        status: OrderStatus.DeliverFailed,
        deliveredBy: driverId,
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

  const kegPickUpFromCustomer = async (req, res) => {
    const body = req.body;
    try {
      const order = await updateOne(body.orderId, {
        status: OrderStatus.Returned,
        kegsReturnedQty: body.kegsReturnedQty,
        tapsReturnedQtr: body.tapsReturnedQty,
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

  const pickUpOrder = async (req, res) => {
    const body = req.body;
    try {
      const order = await updateOne(body.orderId, {
        status: OrderStatus.Pickup,
        pickupAt: Date.now()
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
        returnedAt: Date.now(),
        pickupAt: Date.now()
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

  const addTipToOrder = async (req, res) => {
    const { body } = req;
    const tip = parseInt(body.tip);
    const customerId = parseInt(req.token.id);
    const orderId = parseInt(body.orderId);

    try {
      const order = await db.Order.findOne({
        where: {
          id: orderId,
          customerId
        }
      });

      // Verify that tip is positive integer:
      if (tip < 0) throw new Error("Tip must be positive integer");
      // if tip already exists on order, throw error:
      if (order.tip) throw new Error("Order already has a tip");

      // STRIPE CHARGE:
      const stripeAmount = tip;

      const charge = await stripe.charges.create({
        amount: Math.ceil(stripeAmount),
        currency: "usd",
        description: `Add tip for driver: ${order.deliveredBy} to Order # ${orderId} for Tapster customer: ${customerId}`,
        metadata: { driverId: order.deliveredBy, orderId: orderId },
        source: body.stripeToken
      });

      if (!charge.paid) throw new Error("Payment failed");

      // ORDER UPDATE:

      // Add tip to order
      await order.update({ tip: tip, total: order.total + tip });

      return res.status(200).json({
        Message: "Tip added successfully",
        order,
        charge,
        nonce: body.nonce,
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: err.message });
    }
  };

  return {
    claimOrderforDeliver,
    claimOrderforPickup,
    declaimOrder,
    deliveredOrder,
    deliverFailed,
    kegPickUpFromCustomer,
    pickUpOrder,
    schedulePickUp,
    pickUpFailed,
    addTipToOrder
  };
};

module.exports = OrderUpdateController;
