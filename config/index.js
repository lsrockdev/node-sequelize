const routes = require("./routes/index");

const config = {
  migrate: false,
  routes,
  port: process.env.PORT || "2017"
};

module.exports = config;
