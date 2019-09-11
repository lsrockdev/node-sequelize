var express = require("express");
var router = express.Router();
const productsController = require("../../../api/controllers/products_controller");

const authPolicy = require("../../../api/policies/auth.policy");

router.get("/getProducts", authPolicy, function(req, res) {
  return productsController().getAll(req, res);
});

router.post("/addProduct", authPolicy, function(req, res) {
  return productsController().addOne(req, res);
});

router.post("/updateProduct", authPolicy, function(req, res) {
  return productsController().updateOne(req, res);
});

router.post("/deleteProduct", authPolicy, function(req, res) {
  return productsController().deleteOne(req, res);
});

router.get("/getProductById", authPolicy, function(req, res) {
  return productsController().getById(req, res);
});

module.exports = router;
