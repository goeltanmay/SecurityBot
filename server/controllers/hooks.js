const GitEventHandler = require('./git_event_handler');
const Repo = require('../models').Repo;
const github = require('./actions');
const JWT = require('./jwt');


const gitEvents = {
  'pull_request' : GitEventHandler.pull_request,
  'installation_repositories' : GitEventHandler.installation_repositories,
  'push': GitEventHandler.push,
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

report = function (req, res) {
  res.status(200).send();
  // forward here to github
  var eventType = req.body.eventType;
  var userId = req.body.userId;
	var repoName = req.body.repoName;
	var detail = req.body.detail;
  var vulnerabilities = req.body.vulnerabilities.toString();
	JWT.generateToken("5599")
	.then(function (jwtToken) {
		github.getInstallations(jwtToken)
		.then(function (installations){
			return github.getAccessTokensUrl(installations, userId);
		})
		.then(function(access_tokens_url) {
			return github.postAccessTokenUrl(jwtToken, access_tokens_url);
		})
		.then(github.getToken)
		.then(function (token) {
      if (eventType === "installation_repositories") {
        return github.createIssue(token, userId, repoName, vulnerabilities);
      }
      else if (eventType === "pull_request") {
        return github.postCommentPullRequest(token, userId, repoName, detail, vulnerabilities);
      }
      else if (eventType === "push") {
        return github.postCommentPush(token, userId, repoName, detail, vulnerabilities);
      }
		})
		.then(function (res) {
			return null;
		});
	});
}

module.exports = {
  githook,
  setup,
  register,
  report,
}
