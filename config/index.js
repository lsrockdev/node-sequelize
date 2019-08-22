const routes = require("./routes/index");

const config = {
  migrate: true,
  routes,
  port: process.env.PORT || "2017"
};

module.exports = config;
