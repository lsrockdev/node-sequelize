var express = require("express");
var router = express.Router();
const orderQueryController = require("../../../api/controllers/orders/orders_query_controller");
const authPolicy = require("../../../api/policies/auth.policy");

router.get("/getOrders", authPolicy, function(req, res) {
  return orderQueryController().getOrdersByStoreId(req, res);
});

router.get("/getOrderById", authPolicy, async function(req, res) {
  const id = req.query.id;
  try {
    const order = await orderQueryController().getbyIdForStore({ id });
    return res.status(200).json({
      order,
      message: "success",
      StatusCode: 1
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
