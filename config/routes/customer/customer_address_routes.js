var express = require("express");
var router = express.Router();
const customerAddressesController = require("../../../api/controllers/customer_addresses_controller");
const authPolicy = require("../../../api/policies/auth.policy");

router.post("/addCustomerAddress", authPolicy, function(req, res) {
  return customerAddressesController().addCustomerAddress(req, res);
});

module.exports = router;
