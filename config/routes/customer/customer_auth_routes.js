var express = require("express");
var router = express.Router();
const customerController = require("../../../api/controllers/customers_controller");

router.post("/signup", function(req, res) {
  return res.send("testing");
});

module.exports = router;
