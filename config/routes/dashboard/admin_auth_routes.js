var express = require("express");
var router = express.Router();
const adminController = require("../../../api/controllers/admins_controller");

router.get("/", function(req, res) {
  return res.send("Tapster Admin");
});

router.post("/login", function(req, res) {
  return adminController().login(req, res);
});

router.post("/updateprofile", function(req, res) {
  return adminController().update(req, res);
});

module.exports = router;
