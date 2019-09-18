var express = require("express");
var router = express.Router();
const ordersController = require("../../../api/controllers/orders_controller");
const authPolicy = require("../../../api/policies/auth.policy");

router.post("/placeOrder", authPolicy, function(req, res) {
  return ordersController().placeOrder(req, res);
});

router.get("/getOrders", authPolicy, function(req, res) {
  return ordersController().getAll(req, res);
});

router.get("/getOrderById", authPolicy, function(req, res) {
  return ordersController().getOne(req, res);
});

router.post("/createPaymentIntent", authPolicy, function(req, res) {
  return ordersController().createPaymentIntent(req, res);
});

router.post("/updatePaymentIntent", authPolicy, function(req, res) {
  return ordersController().updatePaymentIntent(req, res);
});

router.post("/stripeWebhook-9929347", function(req, res) {
  return ordersController().stripeWebhook(req, res);
});

module.exports = router;
