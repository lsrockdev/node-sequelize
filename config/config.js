require("dotenv").config(); // this is important!
module.exports = {
  development: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    operatorsAliases: false,
    googleApiKey: process.env.GoogleApiKey
  },
  test: {
    database: process.env.DB_TEST_NAME,
    username: process.env.DB_TEST_USER,
    password: process.env.DB_TEST_PASS,
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    googleApiKey: process.env.GoogleApiKey
  },
  production: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    googleApiKey: process.env.GoogleApiKey
  }
};
