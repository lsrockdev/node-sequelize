var express = require("express");
var router = express.Router();
const inventoryController = require("../../../api/controllers/inventory_controller");
const authPolicy = require("../../../api/policies/auth.policy");

router.get("/getInventories", authPolicy, function(req, res) {
  return inventoryController().getAll(req, res);
});

router.get("/getInventoryById", authPolicy, function(req, res) {
  return inventoryController().getAll(req, res);
});

router.get("/addInventory", authPolicy, function(req, res) {
  return inventoryController().addOne(req, res);
});

router.get("/updateInventory", authPolicy, function(req, res) {
  return inventoryController().updateOne(req, res);
});

router.get("/deleteInventory", authPolicy, function(req, res) {
  return inventoryController().deleteOne(req, res);
});

module.exports = router;
