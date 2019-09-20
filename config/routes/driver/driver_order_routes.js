var express = require("express");
var router = express.Router();
const orderQueryController = require("../../../api/controllers/orders/orders_query_controller");
const orderUpdateController = require("../../../api/controllers/orders/orders_update_controller");
const authPolicy = require("../../../api/policies/auth.policy");

router.get("/getOrders", authPolicy, function(req, res) {
  return orderQueryController().getNewOrders(req, res);
});

router.get("/getOrderById", authPolicy, function(req, res) {
  return orderQueryController().getbyId(req, res);
});
router.get("/getOrderHistory", authPolicy, function(req, res) {
  return orderQueryController().getDriverOrderHistory(req, res);
});
router.post("/claimOrderforDeliver", authPolicy, function(req, res) {
  return orderUpdateController().claimOrderforPickup(req, res);
});
router.post("/claimOrdeforPickup", authPolicy, function(req, res) {
  return orderUpdateController().claimOrdeforPickup(req, res);
});

module.exports = router;
