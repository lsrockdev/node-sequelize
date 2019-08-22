var express = require("express");
var router = express.Router();
const customerController = require("../../../api/controllers/customers_controller");

router.post("/signup", function(req, res) {
  return customerController().register(req, res);
});

router.post("/login", function(req, res) {
  return customerController().login(req, res);
});

module.exports = router;
