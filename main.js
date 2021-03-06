const express = require('express')
const logger = require('morgan');
const bodyParser = require('body-parser');

// var Repos = require('./db.js');


var app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(logger('dev'));
app.set('views', __dirname + '/server/views')
app.set('view engine','pug')
// respond with "hello world" when a GET request is made to the homepage
require('./server/routes')(app);
app.post('*', (req, res) => {
  // console.log(req);
  // console.log(req.get('X-GitHub-Event'));
  res.status(200).send({
    message: 'Welcome to the beginning of nothingness.',
  });
});

module.exports = app;
var port = process.env.PORT || 3000;
app.listen(port);
