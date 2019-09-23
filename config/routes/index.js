var express = require("express");
var router = express.Router();

const customerAuthRoutes = require("./customer/customer_auth_routes");
const customerCartRoutes = require("./customer/customer_cart_routes");
const customerStoreRoutes = require("./customer/customer_store_routes");
const customerCategoryRoutes = require("./customer/customer_categroy_routes");
const customerAddressRoutes = require("./customer/customer_address_routes");
const customerOrderRoutes = require("./customer/customer_order_routes");
const customerProductRoutes = require("./customer/customer_product_routes");

const adminAuthRoutes = require("./dashboard/admin_auth_routes");
const adminSizeRoutes = require("./dashboard/admin_size_route");
const adminCategoryRoutes = require("./dashboard/admin_category_routes");
const adminProductRoutes = require("./dashboard/admin_product_routes");
const adminStoreRoutes = require("./dashboard/admin_store_routes");
const adminStoreCodeRoutes = require("./dashboard/admin_storecode_routes");
const adminSettingRoutes = require("./dashboard/admin_setting_routes");
const adminDriverRoutes = require("./dashboard/admin_driver_routes");

const driverAuthRoutes = require("./driver/driver_auth_routes");
const driverOrderRoutes = require("./driver/driver_order_routes");

const storeAuthRoutes = require("./store/store_auth_routes");

router.use("/customer", customerAuthRoutes);
router.use("/customer", customerCartRoutes);
router.use("/customer", customerStoreRoutes);
router.use("/customer", customerCategoryRoutes);
router.use("/customer", customerAddressRoutes);
router.use("/customer", customerOrderRoutes);
router.use("/customer", customerProductRoutes);

router.use("/admin", adminAuthRoutes);
router.use("/admin", adminSizeRoutes);
router.use("/admin", adminCategoryRoutes);
router.use("/admin", adminProductRoutes);
router.use("/admin", adminStoreRoutes);
router.use("/admin", adminStoreCodeRoutes);
router.use("/admin", adminSettingRoutes);
router.use("/admin", adminDriverRoutes);

router.use("/driver", driverAuthRoutes);
router.use("/driver", driverOrderRoutes);

router.use("/store", storeAuthRoutes);

module.exports = router;
