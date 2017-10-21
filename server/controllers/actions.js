const JWT = require('./jwt');
const Promise = require('bluebird');
var request = require('request-promise');

var jwtToken = JWT.generateToken("5599");
var token = "Bearer " + jwtToken;
var finalToken = "token " + "TOKEN";
var urlRoot = "https://api.github.com"
main();
//listBranches("goeltanmay", "Duke-MEM-MENG")
//postComment("goeltanmay", "Duke-MEM-MENG", 2)
//integration();
//getToken("/installations/59503/access_tokens");

function main() {
	var github = {
		git_token: token,

	  getInstallations: function() {
			return request({
				url: urlRoot + "/integration/installations",
				method: 'GET',
		    json: true,
				headers: {
					"User-Agent": "EnableIssues",
					"content-type": "application/json",
					"Authorization": github.git_token,
		      "Accept": "application/vnd.github.machine-man-preview+json"
				}
			});
		},

		getAccessTokensUrl: function(installations, userId) {
			return new Promise(function(resolve, reject) {
				var counter = 0;
				installations.forEach(function(installation) {
					counter++;
					if(installation.account.login === userId) {
						resolve(installation.access_tokens_url);
					}
					if (counter == installation.length){
						reject("User not found")
					}
				});
			});
		}
	}

	var userId = "goeltanmay";
	return github.getInstallations()
	.then(function (installations){
		return github.getAccessTokensUrl(installations, userId);
	})
	.then(function ( url) {
		console.log("here");
		console.log(url);
	});
}

function integration()
{
	var options = {
		url: urlRoot + "/integration/installations",
		method: 'GET',
    json: true,
		headers: {
			"User-Agent": "EnableIssues",
			"content-type": "application/json",
			"Authorization": token,
      "Accept": "application/vnd.github.machine-man-preview+json"
		}
	};

  console.log(options)

	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body)
	{
		console.log(body );
	});

}

function getToken(url)
{
	var options = {
		url: urlRoot + url,
		method: 'POST',
    json: true,
		headers: {
			"User-Agent": "EnableIssues",
			"content-type": "application/json",
			"Authorization": token,
      "Accept": "application/vnd.github.machine-man-preview+json"
		}
	};

  console.log(options)

	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body)
	{
		console.log(body );
	});

}

function postComment(userId, repo, pullRequestNum)
{
	var options = {
		url: urlRoot + "/repos/" + userId + "/" + repo + "/issues/" + pullRequestNum + "/comments",
		method: 'POST',
		headers: {
			"User-Agent": "EnableIssues",
			"content-type": "application/json",
			"Authorization": finalToken,
      "Accept": "application/vnd.github.machine-man-preview+json"
		},
		json: {
      "body" : "My first comment"
    }
	};

	request(options, function (error, response, body)
	{
		console.log( body );
	});
}
