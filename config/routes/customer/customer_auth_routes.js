var express = require("express");
var router = express.Router();
const customerController = require("../../../api/controllers/customers_controller");
const authPolicy = require("../../../api/policies/auth.policy");

router.post("/signup", function(req, res) {
  return customerController().register(req, res);
});

router.post("/login", function(req, res) {
  return customerController().login(req, res);
});

router.post("/forgotPassword", function(req, res) {
  return customerController().forgotPassword(req, res);
});

router.get("/generateBrainTreeToken", authPolicy, function(req, res) {
  return customerController().generateBraintreeToken(req, res);
});

router.patch("/updateprofile", authPolicy, function(req, res) {
  return customerController().updateProfile(req, res);
});

router.get("/getcustomerprofile", authPolicy, function(req, res) {
  return customerController().getCustomerProfile(req, res);
});

// No auth required since this is a signup and pw reset route
router.post("/createotp", function(req, res) {
  return customerController().createOtp(req, res);
});

module.exports = router;
