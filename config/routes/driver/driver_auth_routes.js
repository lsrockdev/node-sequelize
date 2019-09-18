var express = require("express");
var router = express.Router();
const driverAuthController = require("../../../api/controllers/driver_auth_controller");
// const authPolicy = require("../../../api/policies/auth.policy");

router.post("/authenticate", function(req, res) {
  return driverAuthController().authenticate(req, res);
});

router.post("/signup", function(req, res) {
  return driverAuthController().signUp(req, res);
});

router.post("/getDriverProfile", function(req, res) {
  return driverAuthController().getProfile(req, res);
});

router.post("/updateProfile", function(req, res) {
  return driverAuthController().updateProfile(req, res);
});

module.exports = router;
