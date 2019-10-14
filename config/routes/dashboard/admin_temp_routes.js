var express = require("express");
var router = express.Router();
const storeAuthController = require("../../../api/controllers/store/store_auth_controller");
const driverAuthController = require("../../../api/controllers/driver_auth_controller");
const customerController = require("../../../api/controllers/customers_controller");

router.post("/temp", function(req, res) {
  return customerController().migrate1(req, res);
});
module.exports = router;
