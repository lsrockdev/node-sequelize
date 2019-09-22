var express = require("express");
var router = express.Router();
const storeAuthController = require("../../../api/controllers/store/store_auth_controller");

router.post("/login", function(req, res) {
  return storeAuthController().login(req, res);
});

router.post("/register", function(req, res) {
  return storeAuthController().register(req, res);
});

module.exports = router;
