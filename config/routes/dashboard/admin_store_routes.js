var express = require("express");
var router = express.Router();
const storesQueryController = require("../../../api/controllers/store/store_query_controller");
const storesUpdateController = require("../../../api/controllers/store/store_update_controller");

const authPolicy = require("../../../api/policies/auth.policy");

router.get("/getStores", authPolicy, function(req, res) {
  return storesQueryController().getAll(req, res);
});

router.get("/getStoreById", authPolicy, function(req, res) {
  return storesQueryController().getById(req, res);
});

router.get("/getOrdersByStoreId", authPolicy, function(req, res) {
  return storesQueryController().getOrdersByStoreId(req, res);
});

router.post("/deleteStore", authPolicy, function(req, res) {
  return storesUpdateController().deleteOne(req, res);
});

router.post("/addStore", authPolicy, function(req, res) {
  return storesUpdateController().addOne(req, res);
});

router.post("/updateStore", authPolicy, function(req, res) {
  return storesUpdateController().updateOne(req, res);
});

module.exports = router;
