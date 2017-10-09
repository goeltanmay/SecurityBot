const express = require('express')
const logger = require('morgan');
const bodyParser = require('body-parser');

// var Repos = require('./db.js');


var app = express()

// respond with "hello world" when a GET request is made to the homepage
require('./server/routes')(app);
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));

module.exports = app;
var port = process.env.PORT || 3000;
app.listen(port);
