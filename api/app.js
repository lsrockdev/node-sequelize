require("newrelic"); // Newrelic performance monitoring
require("dotenv").config(); // Allows access to .env vars throughout entire app

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const http = require("http");

var app = express();
const server = http.Server(app);
const config = require("../config/index");
const environment = process.env.NODE_ENV;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/api", config.routes);

server.listen(config.port, () => {
  if (
    environment !== "production" &&
    environment !== "development" &&
    environment !== "testing"
  ) {
    console.error(
      `NODE_ENV is set to ${environment}, but only production and development are valid.`
    );
    process.exit(1);
  }
});

module.exports = app;
