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
        deliveryAddress: await db.UserLocation.findOne({
          where: { customerId: customerId, id: body.addressId }
        })
        // TODO: If keg, Calculate returnedAt data based on noOfReturnDays
      });

      body.lineItems.forEach(async item => {
        // reject order if storeId's don't all match Order.storeId
        if (item.storeId !== order.storeId) {
          return res.status(500).json({
            msg: "Error: LineItems must match storeId of Order"
          });
        }

        // reject if item out of stock:
        if (item.storeId !== order.storeId) {
          return res.status(500).json({
            msg: `Error: ${item.name} is out of stock, please resubmit order without that item.`
          });
        }

        inventory = await db.Inventory.findOne({
          where: { id: item.inventoryId },
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
          price: await inventory.price,
          productId: await inventory.productId,
          extendedPrice: (await inventory.price) * item.qty,
          name: await inventory.name,
          description: await inventory.description,
          depositfee: (await inventory.depositFee) || 0,
          deliveryfee: (await inventory.Category.deliveryFee) * item.qty
        };

        const response = await db.LineItem.create(li);
      });

      // add up delivery fees
      // total order

      // TODO: Calculate tax (currently zero for all stores)
      // TODO: Scheduling add slotStart, slotEnd
      // TODO: Stripe:
      // Insert billing address,
      // set paymentCompleted to true,
      // insert stripeToken.
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }

    return res.status(200).json({
      Message: "Order successfully created",
      // Order: "Order goes here",
      nonce: body.nonce,
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
