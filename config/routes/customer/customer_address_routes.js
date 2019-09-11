var express = require("express");
var router = express.Router();
const customerAddressesController = require("../../../api/controllers/customer_addresses_controller");
const authPolicy = require("../../../api/policies/auth.policy");

router.post('/setActiveCustomerAddress', authPolicy, function(req, res) {
  return customerAddressesController().setActiveCustomerAddress(req, res);
});

router.post("/addCustomerAddress", authPolicy, function(req, res) {
  return customerAddressesController().addCustomerAddress(req, res);
});

router.get("/getCustomerAddresses", authPolicy, function(req, res) {
  return customerAddressesController().getCustomerAddresses(req, res);
});

router.delete("/deleteCustomerAddress", authPolicy, function(req, res) {
  return customerAddressesController().deleteCustomerAddress(req, res);
});

module.exports = router;
