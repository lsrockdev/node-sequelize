require("dotenv").config(); // this is important!
module.exports = {
  development: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: "127.0.0.1",
    dialect: "mysql",
    operatorsAliases: false
  },
  test: {
    database: process.env.DB_TEST_NAME,
    username: process.env.DB_TEST_USER,
    password: process.env.DB_TEST_PASS,
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql"
  },
  production: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql"
  }
};
