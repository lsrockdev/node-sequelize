var express = require("express");
var router = express.Router();
const storesController = require("../../../api/controllers/store_controller");

const authPolicy = require("../../../api/policies/auth.policy");

router.get("/getStores", authPolicy, function(req, res) {
  return storesController().getAll(req, res);
});

router.get("/getStoreById", authPolicy, function(req, res) {
  return storesController().getById(req, res);
});

router.post("/deleteStore", authPolicy, function(req, res) {
  return storesController().deleteOne(req, res);
});

router.post("/addStore", authPolicy, function(req, res) {
  return storesController().addOne(req, res);
});

router.post("/updateStore", authPolicy, function(req, res) {
  return storesController().updateOne(req, res);
});

module.exports = router;
