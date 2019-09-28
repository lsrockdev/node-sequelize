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

      // verify that all stores have stripe tokens
      for (let cart of carts) {
        const storeId = cart.Inventory.Store.id;
        const store = await db.Store.findOne({ where: { id: storeId } });
        if (!store.stripeToken)
          throw new Error("Store does not have stripe account!");
      }

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
        if (!cart.Inventory.price)
          throw new Error("Inventory items must have a price");
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

        // Add up stripe fees: 2.9% + 30 cents:
        let stripeProcessingFees = Math.ceil(
          (subtotal - discount + deliveryFeeTotal) * 0.029
        );

        stripeProcessingFees = stripeProcessingFees + 30;

        const order = await db.Order.create({
          customerId: customerId,
          storeId: storeId,
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
          stripeProcessingFees,
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

        // STRIPE TRANSFER TO STORE
        // Create a Transfer to the store's connected account:
        const transfer = await stripe.transfers.create({
          amount: order.totalPaidToStore - order.stripeProcessingFees,
          currency: "usd",
          metadata: {
            orderTotal: order.totalPaidToStore,
            processingFees: order.stripeProcessingFees
          },
          description: `Order #${order.id} for Tapster customer: ${customerId}`,
          source_transaction: order.stripeChargeId, // Makes sure transfer waits for payment to clear
          destination: store.stripeToken,
          transfer_group: transferGroup
        });
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

      return res.status(200).json({
        Message: "Order successfully created",
        orders,
        charge,
        nonce: body.nonce,
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: err.message });
    }
  };

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
