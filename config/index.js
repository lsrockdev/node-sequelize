const routes = require("./routes/index");

const config = {
  migrate: true,
  routes,
  port: process.env.PORT || "3000"
};

module.exports = config;
