var express = require("express");
var router = express.Router();
const storesQueryController = require("../../../api/controllers/store/store_query_controller");
const storesUpdateController = require("../../../api/controllers/store/store_update_controller");
const authPolicy = require("../../../api/policies/auth.policy");

router.get("/getStoreDetails", authPolicy, async function(req, res) {
  const id = req.query.id;
  try {
    const store = await storesQueryController().getOneBy({ id });
    return res.status(200).json({
      store,
      message: "success",
      StatusCode: 1
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/updateStore", authPolicy, function(req, res) {
  return storesUpdateController().updateOne(req, res);
});

module.exports = router;
