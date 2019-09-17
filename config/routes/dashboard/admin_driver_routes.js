var express = require("express");
var router = express.Router();
const driversController = require("../../../api/controllers/drivers_controller");

const authPolicy = require("../../../api/policies/auth.policy");

router.get("/getDrivers", authPolicy, function(req, res) {
  return driversController().getAll(req, res);
});

router.post("/deleteDriver", authPolicy, function(req, res) {
  return driversController().deleteOne(req, res);
});

router.post("/addDriver", authPolicy, function(req, res) {
  return driversController().addOne(req, res);
});

router.post("/updateDriver", authPolicy, function(req, res) {
  return driversController().updateOne(req, res);
});

module.exports = router;
