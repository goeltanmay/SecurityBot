const Promise = require('bluebird');
var request = require('request-promise');
var urlRoot = "https://api.github.com"

module.exports = {

	getInstallations: function(token) {
		return request({
			url: urlRoot + "/integration/installations",
			method: 'GET',
			json: true,
			headers: {
				"User-Agent": "EnableIssues",
				"content-type": "application/json",
				"Authorization": token,
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

	postAccessTokenUrl: function(token, url) {
		return request({
			url: url,
			method: 'POST',
			json: true,
			headers: {
				"User-Agent": "EnableIssues",
				"content-type": "application/json",
				"Authorization": token,
				"Accept": "application/vnd.github.machine-man-preview+json"
			}
		});
	},

	getToken: function(accessToken) {
		return accessToken.token;
	},

	postCommentPullRequest: function(token, userId, repo, pullRequestNum, message) {
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
				"body" : message
			}
		});
	},

	postCommentPush: function(token, userId, repo, sha, message) {
		return request({
			url: urlRoot + "/repos/" + userId + "/" + repo + "/commits/" + sha + "/comments",
			method: 'POST',
			headers: {
				"User-Agent": "EnableIssues",
				"content-type": "application/json",
				"Authorization": "token " + token,
				"Accept": "application/vnd.github.machine-man-preview+json"
			},
			json: {
				"body" : message
			}
		});
	}

	createIssue: function(token, userId, repo, message) {
		return request({
			url: urlRoot + "/repos/" + userId + "/" + repo + "/issues",
			method: 'POST',
			headers: {
				"User-Agent": "EnableIssues",
				"content-type": "application/json",
				"Authorization": "token " + token,
				"Accept": "application/vnd.github.machine-man-preview+json"
			},
			json: {
				"title" : "Robocop Report"
				"body" : message
			}
		});
	}
}
