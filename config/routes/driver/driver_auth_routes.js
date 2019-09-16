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

module.exports = router;
