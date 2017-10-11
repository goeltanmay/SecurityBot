const Repo = require('../models').Repo;

githook = function (req, res) {
  // do your thing here.
  
}

setup = function(req, res){
  console.log(req.body);
  res.render('setup',{ integration_id : req.query.integration_id });
});

register = function(req,res) {
  var integration_id = req.body.integration_id;
  var instance_url = req.body.instance_url;

});

module.exports = {
  integration,
  setup,
  register,
}
