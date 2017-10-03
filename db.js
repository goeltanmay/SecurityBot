const Sequelize = require('sequelize');

var connection = new Sequelize('node_schema','root','catalunia19',{
  dialect : 'mysql',
  host : 'localhost',
});

var Repos = connection.define('repos',{
  user : Sequelize.STRING,
  repo : Sequelize.STRING,
  instance_url : Sequelize.STRING
});

connection.sync().then(function () {
  exports.Repos = Repos;
  return;
})
