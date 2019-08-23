var express = require("express");
var router = express.Router();
const cartController = require("../../../api/controllers/cart_controller");
const authPolicy = require("../../../api/policies/auth.policy");

router.get("/getcart", authPolicy, function(req, res) {
  return cartController().getAll(req, res);
});

router.post("/addcart", authPolicy, function(req, res) {
  return cartController().addOne(req, res);
});

router.post("/deletecart", authPolicy, function(req, res) {
  return cartController().deleteOne(req, res);
});

module.exports = router;
