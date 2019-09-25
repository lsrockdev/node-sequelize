var express = require("express");
var router = express.Router();
const inventoryController = require("../../../api/controllers/inventory_controller");
const authPolicy = require("../../../api/policies/auth.policy");

router.get("/getInventories", authPolicy, async function(req, res) {
  try {
    const storeId = req.query.storeId;
    const inventories = await inventoryController().getAllByStoreId(storeId);
    return res.status(200).json({
      inventories,
      message: "success",
      StatusCode: 1
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/getInventoryById", authPolicy, async function(req, res) {
  try {
    const id = req.query.id;
    const inventory = await inventoryController().getOneById(id);
    return res.status(200).json({
      inventory,
      message: "success",
      StatusCode: 1
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/addInventory", authPolicy, async function(req, res) {
  try {
    const data = req.body;
    const inventory = await inventoryController().addOne(data);
    return res.status(200).json({
      inventory,
      message: "success",
      StatusCode: 1
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/updateInventory", authPolicy, async function(req, res) {
  try {
    const data = req.body;
    const inventory = await inventoryController().updateOne(data);
    return res.status(200).json({
      inventory,
      message: "success",
      StatusCode: 1
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/deleteInventory", authPolicy, async function(req, res) {
  try {
    const { id } = req.body;
    await inventoryController().deleteOne(id);
    return res.status(200).json({
      message: "success",
      StatusCode: 1
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
