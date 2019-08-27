var express = require("express");
var router = express.Router();
const categoryController = require("../../../api/controllers/category_controller");
const authPolicy = require("../../../api/policies/auth.policy");

router.get("/getCategories", authPolicy, function(req, res) {
  return categoryController().getAll(req, res);
});

module.exports = router;
