const getCurrentUser = require("../helpers/current_user_helper");
const db = require("../services/db.service.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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
        status: 0, // AwaitingPayment
        discount: body.discount,
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
        total: subtotal - discount + deliveryFeeTotal + order.tax + order.tip,
        totalPaidToStore: subtotal - discount + order.tax
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
        include: [
          {
            model: db.LineItem,
            include: [
              {
                model: db.Inventory,
                include: [
                  {
                    model: db.CategorySizes,
                    include: [
                      {
                        model: db.Size,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            model: db.Customer,
            include: [
              {
                model: db.UserLocation,
                where: { isActive: true },
                limit: 1,
              },
            ],
          },
        ]
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

  // TODO: Stripe routes:
  const createPaymentIntent = async (req, res) => {
    const { currency } = req.body;
    const order = await db.Order.findOne({
      where: { id: orderId }
    });

    // Required if we want to transfer part of the payment to a store
    // A transfer group is a unique ID that lets you associate transfers with the original payment
    const transferGroup = `group_${Math.floor(Math.random() * 10)}`;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.total,
      currency: currency,
      transfer_group: transferGroup
    });

    // Send public key and PaymentIntent details to client
    res.send({
      publicKey: env.parsed.STRIPE_PUBLIC_KEY,
      paymentIntent: paymentIntent
    });
  };

  const updatePaymentIntent = async (req, res) => {
    const { orderId, id } = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(id);
    const order = await db.Order.findOne({
      where: { id: orderId },
      include: [db.Store]
    });
    let metadata;

    // Add metadata to track the amount being split between tapster and store
    metadata = Object.assign(paymentIntent.metadata || {}, {
      totalPaidToStore: order.totalPaidToStore,
      storeAccountId: order.Store.stripeToken
    });

    // Update the PaymentIntent with the new amount and metedata
    const updatedPaymentIntent = await stripe.paymentIntents.update(id, {
      amount: order.total,
      metadata: metadata
    });

    res.send({ amount: updatedPaymentIntent.amount });
  };

  // Split and have cust pay the fees like this:
  // stripe.paymentIntents
  //   .create(
  //     {
  //       payment_method_types: ["card"],
  //       amount: 1000,
  //       currency: "usd",
  //       application_fee_amount: 123
  //     },
  //     {
  //       stripe_account: "{{CONNECTED_STRIPE_ACCOUNT_ID}}"
  //     }
  //   )
  //   .then(function(paymentIntent) {
  //     // asynchronously called
  //   });

  // Webhook handler for asynchronous events.
  const stripeWebhook = async (req, res) => {
    const order = await db.Order.findOne({
      where: { id: orderId }
    });

    // Check if webhook signing is configured.
    if (env.parsed.STRIPE_WEBHOOK_SECRET) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = req.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          req.rawBody,
          signature,
          env.parsed.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`);
        return res.sendStatus(400);
      }
      data = event.data;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // we can retrieve the event data directly from the request body.
      data = req.body.data;
      eventType = req.body.type;
    }

    if (eventType === "payment_intent.succeeded") {
      // Customer placed an order and payment succeeded
      // Use Stripe Connect to transfer funds to store's Stripe account

      const order = await db.Order.findOne({
        where: {
          id: data.object.metadata.orderId
        },
        include: [db.Store]
      });

      const transfer = await stripe.transfers.create({
        amount: data.object.metadata.totalPaidToStore,
        currency: "usd",
        destination: data.object.metadata.storeAccountId,
        transfer_group: data.object.transfer_group
      });

      // Mark order as paid:
      await order.update({
        status: 1,
        paymentCompleted: true
      });

      console.log(
        `Payment success: OrderId: ${data.object.metadata.orderId} charged and paid out to store: ${transfer.destination}. Customer email: ${data.object.receipt_email}`
      );
    } else if (eventType === "payment_intent.payment_failed") {
      console.log("❌ Payment failed.");
    }
    res.sendStatus(200);
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

  return {
    placeOrder,
    getAll,
    getOne,
    createPaymentIntent,
    updatePaymentIntent,
    stripeWebhook
  };
};

module.exports = OrdersController;
