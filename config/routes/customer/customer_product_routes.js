var express = require("express");
var router = express.Router();
const favoritesController = require("../../../api/controllers/favorites_controller");
const productsController = require("../../../api/controllers/products_controller");

const authPolicy = require("../../../api/policies/auth.policy");

router.post("/getProductsByCategory", authPolicy, function(req, res) {
  return productsController().getByCategory(req, res);
});

router.post("/updateFavorites", authPolicy, function(req, res) {
  return favoritesController().addorDeleteOne(req, res);
});

router.post("/getFavoriteProducts", authPolicy, function(req, res) {
  return favoritesController().getFavoriteProducts(req, res);
});

module.exports = router;
