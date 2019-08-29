var express = require("express");
var router = express.Router();
const categoryController = require("../../../api/controllers/category_controller");
const favoritesController = require("../../../api/controllers/favorites_controller");

const authPolicy = require("../../../api/policies/auth.policy");

router.get("/getCategories", authPolicy, function(req, res) {
  return categoryController().getAll(req, res);
});

router.post("/updateFavorites", authPolicy, function(req, res) {
  return favoritesController().addorDeleteOne(req, res);
});

router.post("/getFavoriteProducts", authPolicy, function(req, res) {
  return favoritesController().getFavoriteProducts(req, res);
});

module.exports = router;
