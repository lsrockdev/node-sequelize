var express = require("express");
var router = express.Router();
const driverController = require("../../../api/controllers/driver_controller");
// const authPolicy = require("../../../api/policies/auth.policy");

router.post("/authenticate", function(req, res) {
  return driverController().authenticate(req, res);
});

router.post("/signup", function(req, res) {
  return driverController().signUp(req, res);
});

module.exports = router;
