var express = require("express");
var router = express.Router();
const storesQueryController = require("../../../api/controllers/store/store_query_controller");
const storesUpdateController = require("../../../api/controllers/store/store_update_controller");
const authPolicy = require("../../../api/policies/auth.policy");

router.get("/getStoreDetails", authPolicy, function(req, res) {
  req.body.id = req.query.storeId;
  return storesQueryController().getById(req, res);
});

router.post("/updateStore", authPolicy, function(req, res) {
  return storesUpdateController().updateOne(req, res);
});

module.exports = router;
