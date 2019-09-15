var express = require("express");
var router = express.Router();
const codeController = require("../../../api/controllers/code_controller");
const authPolicy = require("../../../api/policies/auth.policy");

router.get("/getUniqueCodes", authPolicy, function(req, res) {
  return codeController().getAll(req, res);
});

router.post("/createUniqueCode", authPolicy, function(req, res) {
  return codeController().createOne(req, res);
});

router.post("/deleteUniqueCode", authPolicy, function(req, res) {
  return codeController().deleteOne(req, res);
});
module.exports = router;
