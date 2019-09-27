var express = require("express");
var router = express.Router();
const orderQueryController = require("../../../api/controllers/orders/orders_query_controller");
const orderUpdateController = require("../../../api/controllers/orders/orders_update_controller");
const authPolicy = require("../../../api/policies/auth.policy");

router.get("/getOrders", authPolicy, function(req, res) {
  return orderQueryController().getOrdersByStatus(req, res);
});

router.get("/getOrderById", authPolicy, function(req, res) {
  return orderQueryController().getbyIdForDriver(req, res);
});
router.get("/getOrderHistory", authPolicy, function(req, res) {
  return orderQueryController().getDriverOrderHistory(req, res);
});
router.post("/claimOrderforDeliver", authPolicy, function(req, res) {
  return orderUpdateController().claimOrderforDeliver(req, res);
});

router.post("/deliveredOrder", authPolicy, function(req, res) {
  return orderUpdateController().deliveredOrder(req, res);
});

router.post("/claimOrdeforPickup", authPolicy, function(req, res) {
  return orderUpdateController().claimOrderforPickup(req, res);
});

router.post("/declaimOrder", authPolicy, function(req, res) {
  return orderUpdateController().declaimOrder(req, res);
});

router.post("/deliverFailed", authPolicy, function(req, res) {
  return orderUpdateController().deliverFailed(req, res);
});

router.post("/pickUpOrder", authPolicy, function(req, res) {
  return orderUpdateController().pickUpOrder(req, res);
});

router.post("/pickUpFailed", authPolicy, function(req, res) {
  return orderUpdateController().pickUpFailed(req, res);
});

module.exports = router;
