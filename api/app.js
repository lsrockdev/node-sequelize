var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const http = require('http');

var app = express();
const server = http.Server(app);
const config = require('../config/');
const environment = process.env.NODE_ENV;
const dbService = require('./services/db.service');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.get('/', function (req, res) {
    res.send('Tapster');
})
  
const DB = dbService(environment, config.migrate).start();

server.listen(config.port, () => {
    if (environment !== 'production' &&
      environment !== 'development' &&
      environment !== 'testing'
    ) {
      console.error(`NODE_ENV is set to ${environment}, but only production and development are valid.`);
      process.exit(1);
    }
    return DB;
});
  
module.exports = app;
