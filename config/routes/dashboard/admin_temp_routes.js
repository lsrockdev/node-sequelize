var express = require("express");
var router = express.Router();
const storeAuthController = require("../../../api/controllers/store/store_auth_controller");

router.post("/temp", function(req, res) {
  return storeAuthController().migrate2(req, res);
});
module.exports = router;
