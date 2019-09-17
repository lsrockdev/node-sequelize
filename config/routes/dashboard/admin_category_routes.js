var express = require("express");
var router = express.Router();
const categoryController = require("../../../api/controllers/category_controller");
const authPolicy = require("../../../api/policies/auth.policy");

router.get("/getCategories", authPolicy, function(req, res) {
  return categoryController().getAllNoProducts(req, res);
});

router.post("/addCategory", authPolicy, function(req, res) {
  return categoryController().addOne(req, res);
});

router.post("/updateCategory", authPolicy, function(req, res) {
  return categoryController().updateOne(req, res);
});
router.post("/deleteCategory", authPolicy, function(req, res) {
  return categoryController().deleteOne(req, res);
});

module.exports = router;
