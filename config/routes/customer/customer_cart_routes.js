var express = require("express");
var router = express.Router();
const cartController = require("../../../api/controllers/cart_controller");

router.get("/getcart", function(req, res) {
  return cartController().getAll(req, res);
});

router.post("/addcart", function(req, res) {
  return cartController().addOne(req, res);
});

router.post("/deletecart", function(req, res) {
  return cartController().deleteOne(req, res);
});

module.exports = router;
