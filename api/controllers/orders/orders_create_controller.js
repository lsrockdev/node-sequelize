// const getCurrentUser = require("../helpers/current_user_helper");
const db = require("../../../api/services/db.service");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const OrderStatus = require("../../constant/enum").OrderStatus;
const notificationsService = require("../../services/notifications.service");

const OrdersController = () => {
  const placeOrder = async (req, res) => {
    const { body } = req;
    const couponCode = body.couponCode;
    let discount = 0;
    const tip = parseInt(body.tip) || 0;
    const customerId = req.token.id;
    const slotId = body.slotId;
    let orderIds = [];
    let couponApplied = false; // Ensures coupon only gets applied one time in multi-store order

    // Create an orderCount variable to enforce coupon use for first-time orders only:
    let orderCount = await db.Order.count({
      where: { customerId }
    });

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
                model: db.Product,
                include: [
                  {
                    model: db.Category,
                    attributes: ["id", "deliveryFee"]
                  }
                ]
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
        // For launch, process even if store doesn't have stripe token:
        // if (!store.stripeToken)
        //   throw new Error("Store does not have stripe account!");
      }

      for (let cart of carts) {
        const storeId = cart.Inventory.Store.id;
        if (!storeItems.hasOwnProperty(storeId)) {
          storeItems[storeId] = [];
        }
        storeItems[storeId].push(cart);

        // Add price and delivery fees to total:

        // If store isnt' in the totals object yet, add it:
        if (!storeTotals.hasOwnProperty(storeId)) {
          storeTotals[storeId] = { subtotal: 0, deliveryFeeTotal: 0 };
        }
        if (!cart.Inventory.price)
          throw new Error("Inventory items must have a price");

        // Calculate extended price for cart item based on qty:
        const itemTotal = cart.Inventory.price * cart.quantity;

        // Calculate delivery fees for this cart item based on qty:
        let deliveryFeeTotal =
          parseInt(cart.Inventory.Product.Category.deliveryFee) *
          parseInt(cart.quantity);

        // Update storeTotals object with this cart item total and delivery fees:
        storeTotals[storeId]["subtotal"] += itemTotal;
        storeTotals[storeId]["deliveryFeeTotal"] += deliveryFeeTotal;

        // Update storeTotals[all] with this cart itemTotal and deliveryFees:
        storeTotals.all.subtotal += parseInt(itemTotal);
        storeTotals.all.deliveryFeeTotal += parseInt(deliveryFeeTotal);
      }

      // STRIPE CHARGE:
      const transferGroup = `group_${Date.now()}`;
      const stripeAmount =
        storeTotals.all.subtotal + storeTotals.all.deliveryFeeTotal + tip;

      // console.log("============", stripeAmount);
      // console.log(
      //   "============",
      //   storeTotals.all.subtotal,
      //   storeTotals.all.deliveryFeeTotal,
      //   tip
      // );
      const charge = await stripe.charges.create({
        amount: Math.ceil(stripeAmount),
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
        const store = await db.Store.findOne({ where: { id: storeId } });

        // NOTE: This determines the total number of kegs in the order
        // based on whether or not the ordered product is in one of
        // two Categories: "Small Keg" or "Large Keg".
        //
        // There are potentially multiple ways to make this determination
        // based on the current database schema however this was the
        // current agreed upon initial implementation. Other solutions
        // could involve checking any of the following assuming that
        // these fields are being maintained:
        //
        // categories.name
        // carts.hastap
        // inventories.isKeg
        // inventories.kegtypeId
        // products.isKeg
        //
        let totalKegs = storeItems[storeId].reduce((kegs, cart) => {
          let categoryName = cart.Inventory.Category.name;
          let kegCategories = ["Small Keg", "Large Keg"];
          let isKeg = kegCategories.includes(categoryName);
          return isKeg ? kegs + 1 : kegs;
        }, 0);

        // Apply coupon code TAP5 if used:
        // only applies if new customer - first order
        if (
          couponCode &&
          couponCode.toLowerCase() === "tap5" &&
          !couponApplied &&
          orderCount < 1
        ) {
          console.log("Applying coupon TAP5 to order");
          // only discount from delivery fees. up to $5
          if (deliveryFeeTotal < 500) {
            discount = parseInt(deliveryFeeTotal);
          } else {
            discount = 500;
          }
          // flip couponApplied to true so discount only applies once in orders loop:
          couponApplied = true;
        } else {
          // Set discount back to zero if coupon already applied to an order:
          discount = 0;
        }

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
          status: OrderStatus.Paid, // Paid
          discount: discount,
          instructions: body.instructions,
          gift: body.gift,
          kegsDeliveredQty: totalKegs,
          tapsDeliveredQty: totalKegs,
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
          }),
          slotId: slotId
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

        // Disallow more deliveries for the Slot if maxDeliveriesAllowed has been reached
        let deliveriesCount = await db.Order.count({
          where: { slotId: slotId }
        });
        let slot = await db.Slot.findOne({ where: { id: slotId } });
        if (deliveriesCount >= slot.maxDeliveriesAllowed) {
          await db.Slot.update({ isMaxedOut: true }, { where: { id: slotId } });
        }

        // STRIPE TRANSFER TO STORE
        // Create a Transfer to the store's connected account:
        if (store.stripeToken) {
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
        } else {
          console.log(
            "Store doesn't have stripe connect ID. Transfer skipped.",
            `Order #${order.id} for Tapster customer: ${customerId}, storeId: ${
              store.id
            }, transferGroup: ${transferGroup}, 
            orderTotal: ${order.totalPaidToStore}, processingFees: ${
              order.stripeProcessingFees
            }, transfer amount:
            ${order.totalPaidToStore - order.stripeProcessingFees}`
          );
        }
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

      // Send SMS message to admins for each order:
      for (let order of orders) {
        const store = await db.Store.findOne({ where: { id: order.storeId } });
        const slot = await db.Slot.findOne({
          where: { id: order.slotId }
        });
        const deliveryDateTime = slot.start;

        let message = `Order No. ${order.id} has been placed to store ${store.name} and delivery date is ${deliveryDateTime}`;
        await notificationsService().sendSmsToAdmins(message);
      }

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
        deliveryfee: item.Inventory.Product.Category.deliveryFee * item.quantity
      };
      const response = await db.LineItem.create(li);
      // add up delivery fees
      deliveryFeeTotal = deliveryFeeTotal + response.deliveryfee;
      subtotal = subtotal + response.extendedPrice;

      //count down inventory quantity
      const downQuantity = item.Inventory.quantity - item.quantity;
      const inventory = await db.Inventory.findOne({
        where: { id: item.Inventory.id }
      });
      await inventory.update({ quantity: downQuantity });
    }
    return { subtotal, deliveryFeeTotal };
  };

  return {
    placeOrder
  };
};

module.exports = OrdersController;
