// const getCurrentUser = require("../helpers/current_user_helper");
const db = require("../../../api/services/db.service");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const OrdersController = () => {
  const placeOrder = async (req, res) => {
    const { body } = req;
    const discount = body.discount || 0;
    const tip = parseInt(body.tip) || 0;
    const customerId = req.token.id;
    let orderIds = [];
    // const currentUser = await getCurrentUser("db.Customer", customerId);

    try {
      // Verify that tip is positive integer:
      if (body.tip < 0) throw new Error("Tip must be positive integer");

      // Grab all cart records for customer and prepare order(s):
      const carts = await db.Cart.findAll({
        where: {
          customerId,
          isDeleted: false
        },
        include: [
          {
            model: db.Inventory,
            include: [
              {
                model: db.Store
              },
              {
                model: db.Product
              },
              {
                model: db.Category
              }
            ]
          }
        ]
      });

      const storeItems = {};
      const storeTotals = { all: { subtotal: 0, deliveryFeeTotal: 0 } };

      for (let cart of carts) {
        const storeId = cart.Inventory.Store.id;
        if (!storeItems.hasOwnProperty(storeId)) {
          storeItems[storeId] = [];
        }
        storeItems[storeId].push(cart);

        // Add price and delivery fees to total
        if (!storeTotals.hasOwnProperty(storeId)) {
          storeTotals[storeId] = { subtotal: 0, deliveryFeeTotal: 0 };
        }
        const itemTotal = cart.Inventory.price * cart.quantity;
        const deliveryFeeTotal =
          parseInt(cart.Inventory.Category.deliveryFee) *
          parseInt(cart.quantity);
        storeTotals[storeId]["subtotal"] =
          storeTotals[storeId]["subtotal"] + itemTotal;
        storeTotals[storeId]["deliveryFeeTotal"] =
          storeTotals[storeId]["deliveryFeeTotal"] +
          parseInt(cart.Inventory.Category.deliveryFee);

        // update storeTotals[all]
        storeTotals.all.subtotal = storeTotals.all.subtotal + itemTotal;
        storeTotals.all.deliveryFeeTotal =
          storeTotals.all.deliveryFeeTotal + deliveryFeeTotal;
      }

      // STRIPE CHARGE:
      const transferGroup = `group_${Date.now()}`;
      const stripeAmount =
        storeTotals.all.subtotal + storeTotals.all.deliveryFeeTotal + tip;

      const charge = await stripe.charges.create({
        amount: stripeAmount,
        currency: "usd",
        description: `Order for Tapster customer: ${customerId}`,
        source: body.stripeToken,
        transfer_group: transferGroup
      });

      if (!charge.paid) throw new Error("Payment failed");

      // ORDER CREATE:

      // Tip should be applied only to first order in entire batch:
      let driverTipped = false;

      // For each store:
      for (let storeId of Object.keys(storeItems)) {
        const { subtotal, deliveryFeeTotal } = storeTotals[storeId];

        const order = await db.Order.create({
          customerId: customerId,
          storeId: body.storeId,
          subtotal: subtotal,
          deliveryFees: deliveryFeeTotal,
          total: driverTipped
            ? subtotal - discount + deliveryFeeTotal
            : subtotal - discount + deliveryFeeTotal + tip,
          totalPaidToStore: subtotal,
          tip: driverTipped ? 0 : tip,
          status: 1, // Paid
          discount: discount, // Can be calculated in the future with coupon codes
          instructions: body.instructions,
          stripeToken: body.stripeToken,
          stripeCardType: charge.payment_method_details.card.brand,
          stripePaymentAmount: charge.payment_method_details.card.amount,
          stripeLast4: charge.payment_method_details.card.last4,
          stripeChargeId: charge.id,
          billingAddress: charge.billing_details.address,
          paymentCompleted: true,
          deliveryAddress: await db.UserLocation.findOne({
            where: { customerId: customerId, id: body.addressId }
          })
          // TODO: If keg, Calculate returnedAt data based on noOfReturnDays
          // TODO: If needed in future, calculate tax and add in:
          //    total: subtotal - discount + deliveryFeeTotal + order.tax + body.tip,
          //    totalPaidToStore: subtotal - discount + order.tax,
        });

        // Push orderId onto orders array for http response:
        orderIds.push(order.id);

        // Flip switch so subsequent orders will not duplicate tip:
        driverTipped = true;

        // Loop through lineitems and create them for order:
        await createLineItemsForOrder(order.id, storeItems[storeId]);
      }

      // Remove all carts for this customer
      await db.Cart.update(
        { isDeleted: true },
        {
          where: {
            customerId,
            isDeleted: false
          }
        }
      );

      const orders = await db.Order.findAll({
        where: { id: orderIds },
        include: [db.LineItem]
      });

      // TODO: Scheduling add slotStart, slotEnd
      // TODO: Use Transfer group to split to each connected account (store)

      // // Create a Charge:
      // stripe.charges.create({
      //   amount: 10000,
      //   currency: "usd",
      //   source: "tok_visa",
      //   transfer_group: transferGroup,
      // }).then(function (charge) {
      //   // asynchronously called
      // });

      // // Create a Transfer to the connected account (later):
      // stripe.transfers.create({
      //   amount: 7000,
      //   currency: "usd",
      //   destination: "{{CONNECTED_STRIPE_ACCOUNT_ID}}",
      //   transfer_group: transferGroup,
      // }).then(function (transfer) {
      //   // asynchronously called
      // });

      // // Create a second Transfer to another connected account (later):
      // stripe.transfers.create({
      //   amount: 2000,
      //   currency: "usd",
      //   destination: "{OTHER_CONNECTED_STRIPE_ACCOUNT_ID}",
      //   transfer_group: transferGroup,
      // }).then(function (second_transfer) {
      //   // asynchronously called
      // });

      return res.status(200).json({
        Message: "Order successfully created",
        orders,
        charge,
        nonce: body.nonce,
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err });
    }
  };

  // const createPaymentIntent = async (req, res) => {
  //   const { currency } = req.body;
  //   const order = await db.Order.findOne({
  //     where: { id: orderId }
  //   });

  //   // Required if we want to transfer part of the payment to a store
  //   // A transfer group is a unique ID that lets you associate transfers with the original payment
  //   const transferGroup = `group_${Math.floor(Math.random() * 10)}`;

  //   // Create a PaymentIntent with the order amount and currency
  //   const paymentIntent = await stripe.paymentIntents.create({
  //     amount: order.total,
  //     currency: currency,
  //     transfer_group: transferGroup
  //   });

  //   // Send public key and PaymentIntent details to client
  //   res.send({
  //     publicKey: env.parsed.STRIPE_PUBLIC_KEY,
  //     paymentIntent: paymentIntent
  //   });
  // };

  // const updatePaymentIntent = async (req, res) => {
  //   const { orderId, id } = req.body;
  //   const paymentIntent = await stripe.paymentIntents.retrieve(id);
  //   const order = await db.Order.findOne({
  //     where: { id: orderId },
  //     include: [db.Store]
  //   });
  //   let metadata;

  //   // Add metadata to track the amount being split between tapster and store
  //   metadata = Object.assign(paymentIntent.metadata || {}, {
  //     totalPaidToStore: order.totalPaidToStore,
  //     storeAccountId: order.Store.stripeToken
  //   });

  //   // Update the PaymentIntent with the new amount and metedata
  //   const updatedPaymentIntent = await stripe.paymentIntents.update(id, {
  //     amount: order.total,
  //     metadata: metadata
  //   });

  //   res.send({ amount: updatedPaymentIntent.amount });
  // };

  // // Split and have cust pay the fees like this:
  // // stripe.paymentIntents
  // //   .create(
  // //     {
  // //       payment_method_types: ["card"],
  // //       amount: 1000,
  // //       currency: "usd",
  // //       application_fee_amount: 123
  // //     },
  // //     {
  // //       stripe_account: "{{CONNECTED_STRIPE_ACCOUNT_ID}}"
  // //     }
  // //   )
  // //   .then(function(paymentIntent) {
  // //     // asynchronously called
  // //   });

  // // Webhook handler for asynchronous events.
  // const stripeWebhook = async (req, res) => {
  //   const order = await db.Order.findOne({
  //     where: { id: orderId }
  //   });

  //   // Check if webhook signing is configured.
  //   if (env.parsed.STRIPE_WEBHOOK_SECRET) {
  //     // Retrieve the event by verifying the signature using the raw body and secret.
  //     let event;
  //     let signature = req.headers["stripe-signature"];
  //     try {
  //       event = stripe.webhooks.constructEvent(
  //         req.rawBody,
  //         signature,
  //         env.parsed.STRIPE_WEBHOOK_SECRET
  //       );
  //     } catch (err) {
  //       console.log(`⚠️  Webhook signature verification failed.`);
  //       return res.sendStatus(400);
  //     }
  //     data = event.data;
  //     eventType = event.type;
  //   } else {
  //     // Webhook signing is recommended, but if the secret is not configured in `config.js`,
  //     // we can retrieve the event data directly from the request body.
  //     data = req.body.data;
  //     eventType = req.body.type;
  //   }

  //   if (eventType === "payment_intent.succeeded") {
  //     // Customer placed an order and payment succeeded
  //     // Use Stripe Connect to transfer funds to store's Stripe account

  //     const order = await db.Order.findOne({
  //       where: {
  //         id: data.object.metadata.orderId
  //       },
  //       include: [db.Store]
  //     });

  //     const transfer = await stripe.transfers.create({
  //       amount: data.object.metadata.totalPaidToStore,
  //       currency: "usd",
  //       destination: data.object.metadata.storeAccountId,
  //       transfer_group: data.object.transfer_group
  //     });

  //     // Mark order as paid:
  //     await order.update({
  //       status: 1,
  //       paymentCompleted: true
  //     });

  //     console.log(
  //       `Payment success: OrderId: ${data.object.metadata.orderId} charged and paid out to store: ${transfer.destination}. Customer email: ${data.object.receipt_email}`
  //     );
  //   } else if (eventType === "payment_intent.payment_failed") {
  //     console.log("❌ Payment failed.");
  //   }
  //   res.sendStatus(200);
  // };

  const createLineItemsForOrder = async (orderId, lineItems) => {
    let subtotal = 0;
    let deliveryFeeTotal = 0;
    for (let item of lineItems) {
      // reject if item out of stock:
      if (!item.Inventory.isActive) {
        throw `Error: ${item.name} is out of stock, please resubmit order without that item.`;
      }
      // inventory = await db.Inventory.findOne({
      //   where: {
      //     id: item.inventoryId
      //   },
      //   include: [db.Category]
      // });
      // loop through and create LineItems:
      const li = {
        // Capitalized O and I to work around weird sequelize issue of sending
        // duplicate OrderId and orderId, and InventoryId and inventoryId fields:
        OrderId: orderId,
        InventoryId: item.Inventory.id,
        qty: item.quantity,
        // Clone Inventory details to LineItems:
        price: item.Inventory.price,
        productId: item.Inventory.productId,
        extendedPrice: item.Inventory.price * item.quantity,
        name: item.Inventory.name,
        description: item.Inventory.description,
        depositfee: item.Inventory.depositFee || 0,
        deliveryfee: item.Inventory.Category.deliveryFee * item.quantity
      };
      const response = await db.LineItem.create(li);
      // add up delivery fees
      deliveryFeeTotal = deliveryFeeTotal + response.deliveryfee;
      subtotal = subtotal + response.extendedPrice;
    }
    return { subtotal, deliveryFeeTotal };
  };

  return {
    placeOrder
  };
};

module.exports = OrdersController;
