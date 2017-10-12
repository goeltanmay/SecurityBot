const GitEventHandler = require('./git_event_handler');
const Repo = require('../models').Repo;

const gitEvents = {
  'pull_request' : GitEventHandler.pull_request,
}
githook = function (req, res) {
  // do your thing here.
  var git_event = req.get('X-GitHub-Event');
  gitEvents[git_event](req, res);
}

setup = function(req, res){
  console.log(req.body);
  res.render('setup',{ installation_id : req.query.installation_id });
}

register = function(req,res) {
  var integration_id = req.body.integration_id;
  var instance_url = req.body.instance_url;

}

module.exports = {
  githook,
  setup,
  register,
}
