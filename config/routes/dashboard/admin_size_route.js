var express = require("express");
var router = express.Router();
const sizeController = require("../../../api/controllers/size_controller");
const authPolicy = require("../../../api/policies/auth.policy");

router.get("/getSizes", authPolicy, function(req, res) {
  return sizeController().getAll(req, res);
});

router.post("/addSize", authPolicy, function(req, res) {
  return sizeController().addOne(req, res);
});

router.post("/updateSize", authPolicy, function(req, res) {
  return sizeController().updateOne(req, res);
});

router.post("/deleteSize", authPolicy, function(req, res) {
  return sizeController().deleteOne(req, res);
});

module.exports = router;
