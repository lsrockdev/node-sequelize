var express = require("express");
var router = express.Router();
const settingsController = require("../../../api/controllers/settings_controller");

const authPolicy = require("../../../api/policies/auth.policy");

router.get("/getSettings", authPolicy, function(req, res) {
  return settingsController().getAll(req, res);
});

router.get("/getSettingByName", authPolicy, function(req, res) {
  return settingsController().getByName(req, res);
});

router.post("/updateSetting", authPolicy, function(req, res) {
  return settingsController().updateOne(req, res);
});

module.exports = router;
