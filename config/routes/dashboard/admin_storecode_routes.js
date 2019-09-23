var express = require("express");
var router = express.Router();
const codeController = require("../../../api/controllers/code_controller");
const authPolicy = require("../../../api/policies/auth.policy");

router.get("/getUniqueCodes", authPolicy, async function(req, res) {
  try {
    const storeCodes = await codeController().getAll();
    return res.status(200).json({
      storeCodes,
      message: "success",
      StatusCode: 1
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/createUniqueCode", authPolicy, async function(req, res) {
  try {
    const storeCode = await codeController().createOne(req, res);
    return res.status(200).json({
      storeCode: storeCode,
      message: "Code Added Succesfully",
      StatusCode: 1
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/deleteUniqueCode", authPolicy, async function(req, res) {
  try {
    const { id } = req.body;
    await codeController().deleteOne(id);
    return res.status(200).json({
      message: "StoreCode Deleted Succesfully",
      StatusCode: 1
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
