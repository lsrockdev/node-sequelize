var express = require("express");
var router = express.Router();

const customerAuthRoutes = require("./customer/customer_auth_routes");
const adminAuthRoutes = require("./dashboard/admin_auth_routes");

router.use("/customer", customerAuthRoutes);
router.use("/admin", adminAuthRoutes);

module.exports = router;
