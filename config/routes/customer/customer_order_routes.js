var express = require("express");
var router = express.Router();
const ordersController = require("../../../api/controllers/orders_controller");
const authPolicy = require("../../../api/policies/auth.policy");

router.post("/placeOrder", authPolicy, function(req, res) {
  return ordersController().placeOrder(req, res);
});

module.exports = router;
