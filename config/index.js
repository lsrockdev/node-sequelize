const routes = require("./routes/index");

const config = {
  migrate: false,
  routes,
  port: process.env.PORT || "3306"
};

module.exports = config;
