const getCurrentUser = require("../helpers/current_user_helper");
const db = require("../services/db.service.js");

const OrdersController = () => {
  const placeOrder = async (req, res) => {
    const { body } = req;
    const customerId = req.token.id;
    // const currentUser = await getCurrentUser("db.Customer", customerId);

    try {
      order = await db.Order.create({
        customerId: customerId,
        storeId: body.storeId,
        tip: body.tip,
        tax: 0,
        status: 0,
        deliveryAddress: await db.UserLocation.findOne({
          where: { customerId: customerId, id: body.addressId }
        })
        // TODO: If keg, Calculate returnedAt data based on noOfReturnDays
      });

      // Loop through lineitems and create them for order:
      const { subtotal, deliveryFeeTotal } = await createLineItemsForOrder(
        body
      );

      // update order with totals
      const totaledOrder = await order.update({
        subtotal: subtotal,
        deliveryFees: deliveryFeeTotal,
        total: subtotal + deliveryFeeTotal + order.tax + order.tip
      });

      // TODO: Calculate tax (currently zero for all stores)
      // TODO: Scheduling add slotStart, slotEnd
      // TODO: Stripe:
      // Insert billing address,
      // set paymentCompleted to true,
      // insert stripeToken.
      return res.status(200).json({
        Message: "Order successfully created",
        order: await db.Order.findOne({
          where: { id: order.id },
          include: [db.LineItem]
        }),
        nonce: body.nonce,
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err });
    }
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

  const createLineItemsForOrder = async body => {
    let subtotal = 0;
    let deliveryFeeTotal = 0;
    for (const item of body.lineItems) {
      // reject order if storeId's don't all match Order.storeId
      if (item.storeId !== order.storeId) {
        throw "Error: LineItems must match storeId of Order";
      }
      // reject if item out of stock:
      if (item.storeId !== order.storeId) {
        throw `Error: ${item.name} is out of stock, please resubmit order without that item.`;
      }
      inventory = await db.Inventory.findOne({
        where: {
          id: item.inventoryId
        },
        include: [db.Category]
      });
      // loop through and create LineItems:
      const li = {
        // Capitalized O and I to work around weird sequelize issue of sending
        // duplicate OrderId and orderId, and InventoryId and inventoryId fields:
        OrderId: order.id,
        InventoryId: item.inventoryId,
        qty: item.qty,
        // Clone Inventory details to LineItems:
        price: inventory.price,
        productId: inventory.productId,
        extendedPrice: inventory.price * item.qty,
        name: inventory.name,
        description: inventory.description,
        depositfee: inventory.depositFee || 0,
        deliveryfee: inventory.Category.deliveryFee * item.qty
      };
      const response = await db.LineItem.create(li);
      // add up delivery fees
      deliveryFeeTotal = deliveryFeeTotal + response.deliveryfee;
      subtotal = subtotal + response.extendedPrice;
    }
    return { subtotal, deliveryFeeTotal };
  };

  return { placeOrder, getAll, getOne };
};

module.exports = OrdersController;
