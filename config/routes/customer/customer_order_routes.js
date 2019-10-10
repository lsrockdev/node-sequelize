var express = require("express");
var router = express.Router();
const ordersCreateController = require("../../../api/controllers/orders/orders_create_controller");
const ordersQueryController = require("../../../api/controllers/orders/orders_query_controller");
const ordersUpdateController = require("../../../api/controllers/orders/orders_update_controller");

const authPolicy = require("../../../api/policies/auth.policy");

router.post("/placeOrder", authPolicy, function(req, res) {
  return ordersCreateController().placeOrder(req, res);
});

router.get("/getOrders", authPolicy, function(req, res) {
  return ordersQueryController().getCustomerOrders(req, res);
});

router.get("/getOrderById", authPolicy, function(req, res) {
  return ordersQueryController().getbyIdForCustomer(req, res);
});

router.post("/schedulePickUp", authPolicy, function(req, res) {
  return ordersUpdateController().schedulePickUp(req, res);
});

router.post("/rescheduleDelivery", authPolicy, function(req, res) {
  return ordersUpdateController().rescheduleDelivery(req, res);
});

router.post("/addTipToOrder", authPolicy, function(req, res) {
  return ordersUpdateController().addTipToOrder(req, res);
});

router.post("/createPaymentIntent", authPolicy, function(req, res) {
  return ordersCreateController().createPaymentIntent(req, res);
});

router.post("/updatePaymentIntent", authPolicy, function(req, res) {
  return ordersCreateController().updatePaymentIntent(req, res);
});

router.post("/stripeWebhook-9929347", function(req, res) {
  return ordersCreateController().stripeWebhook(req, res);
});

module.exports = router;
