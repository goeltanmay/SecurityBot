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
		},

		postAccessTokenUrl: function(url) {
			return request({
				url: url,
				method: 'POST',
		    json: true,
				headers: {
					"User-Agent": "EnableIssues",
					"content-type": "application/json",
					"Authorization": github.git_token,
		      "Accept": "application/vnd.github.machine-man-preview+json"
				}
			});
		},

		getToken: function(accessToken) {
			return accessToken.token;
		},

		postComment: function(token, userId, repo, pullRequestNum) {
			return request({
				url: urlRoot + "/repos/" + userId + "/" + repo + "/issues/" + pullRequestNum + "/comments",
				method: 'POST',
				headers: {
					"User-Agent": "EnableIssues",
					"content-type": "application/json",
					"Authorization": "token " + token,
		      "Accept": "application/vnd.github.machine-man-preview+json"
				},
				json: {
		      "body" : "My second comment"
		    }
			});
		}
	}

	var userId = "goeltanmay";
	var repo = "Duke-MEM-MENG";
	var pullRequestNum = 2;
	return github.getInstallations()
	.then(function (installations){
		return github.getAccessTokensUrl(installations, userId);
	})
	.then(github.postAccessTokenUrl)
	.then(github.getToken)
	.then(function (token) {
		return github.postComment(token, userId, repo, pullRequestNum);
	})
	.then(function (res) {
		console.log("here");
		console.log(res);
	});
}
