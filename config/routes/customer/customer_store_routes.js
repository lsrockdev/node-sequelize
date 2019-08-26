var express = require("express");
var router = express.Router();
const storeController = require("../../../api/controllers/store_controller");
const authPolicy = require("../../../api/policies/auth.policy");

router.get("/getStoresByCustomerId", authPolicy, function(req, res) {
  return storeController().getByCustomerId(req, res);
});

router.post("/getStoresByLocation", authPolicy, function(req, res) {
  return storeController().getByLocation(req, res);
});

module.exports = router;
