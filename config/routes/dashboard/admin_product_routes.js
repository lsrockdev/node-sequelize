var express = require("express");
var router = express.Router();
const productsController = require("../../../api/controllers/products_controller");

const authPolicy = require("../../../api/policies/auth.policy");

router.post("/getProducts", authPolicy, function(req, res) {
  return productsController().getByCategory(req, res);
});

router.post("/addProduct", authPolicy, function(req, res) {
  return productsController().addOne(req, res);
});

router.post("/deleteProduct", authPolicy, function(req, res) {
  return productsController().deleteOne(req, res);
});

router.post("/getProductById", authPolicy, function(req, res) {
  return productsController().getById(req, res);
});

module.exports = router;
