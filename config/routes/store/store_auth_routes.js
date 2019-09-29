var express = require("express");
var router = express.Router();
const storeAuthController = require("../../../api/controllers/store/store_auth_controller");
const storeQueryController = require("../../../api/controllers/store/store_query_controller");
const storeUpdateController = require("../../../api/controllers/store/store_update_controller");

const authPolicy = require("../../../api/policies/auth.policy");

router.post("/authenticate", function(req, res) {
  return storeAuthController().login(req, res);
});

router.post("/register", function(req, res) {
  return storeAuthController().register(req, res);
});

router.get("/getStoreDetails", authPolicy, function(req, res) {
  return storeQueryController().getById(req, res);
});

router.post("/updateStore", authPolicy, function(req, res) {
  return storeUpdateController().updateOne(req, res);
});

module.exports = router;
