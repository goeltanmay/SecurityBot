const GitEventHandler = require('./git_event_handler');
const Repo = require('../models').Repo;
const RepoEvent = require('../models').RepoEvent;
const github = require('./actions');
const JWT = require('./jwt');
const nodemailer = require('nodemailer');

const gitEvents = {
  'pull_request' : GitEventHandler.pull_request,
  'installation_repositories' : GitEventHandler.installation_repositories,
  'push': GitEventHandler.push,
}

githook = function (req, res) {
  // do your thing here.
  console.log(req.get('X-GitHub-Event'));
  var git_event = req.get('X-GitHub-Event');
  gitEvents[git_event](req, res);
}

setup = function(req, res){
  console.log(req.body);
  res.render('setup',{ installation_id : req.query.installation_id });
}

emailReportForm = function(req, res) {
  res.render('emailReport');
}

register = function(req,res) {
  var integration_id = req.body.integration_id;
  var instance_url = req.body.instance_url;

}

report = function (req, res) {
  res.status(200).send();
  // forward here to github
  console.log(req.body);
  var eventType = req.body.eventType;
  var userId = req.body.userId;
	var repoName = req.body.repoName;
	var detail = req.body.detail;
  var vulnerabilities = req.body.vulnerabilities.toString();

  if (eventType === "email_request") {
    var transporter = nodemailer.createTransport({
      service : 'Gmail',
      auth: {
             user: process.env.gmail_username, // Your email id
             pass: process.env.gmail_password // Your password
         }
    });

    var mailOptions = {
      from: process.env.gmail_username, // sender address
      to: detail, // list of receivers
      subject: 'Robocop Report', // Subject line
      text: vulnerabilities //, // plaintext body
    };

    transporter.sendMail(mailOptions, function(error, info){
      if(error){
          console.log(error);
          res.json({yo: 'error'});
      }else{
          console.log('Message sent: ' + info.response);
          res.json({yo: info.response});
      };
    });

    res.status(200).send();
  }
	else {
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
}

email = function(req, res) {
  Repo.findOne({
    where: {
      username: req.body.userId,
      repo: req.body.repo
    }
  })
  .then(repo => {
    RepoEvent.create({
      type: 'email_request',
      detail: req.body.email,
      repoId: repo.id,
      current_commit: null,
      previous_commit: null,
    })
    .then(repoEvent => res.status(201).send(repo))
    .catch(error => res.status(500).send(error));
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  });
}

module.exports = {
  githook,
  setup,
  register,
  report,
  emailReportForm,
  email,
}
