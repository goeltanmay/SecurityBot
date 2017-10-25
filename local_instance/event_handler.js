var attack_tools=require('./attack_tools.js')
var filter_results=require('./filter_results.js');
var fs=require('fs');
var data = fs.readFileSync('./conf.json'),repositoryInfo;
var sys  = require('util');
var exec = require('child_process').exec;

const Promise = require('bluebird');
// handle_event('push','0222cb99792c7c3c62fc4d345a9f599237d9321d','192978a3ef1a6046a14d96624911ff1df02c15ef').then(function(result){
// 	console.log('----------------result');
// 	console.log(result);
// });

function handle_event(event, current_commitId, parent_commitId,repo_name)
{
	return new Promise(function(resolve,reject){

		//console.log("handle_event called");

		if(event==="push" || event ==="pull_request"||event==="installation_repositories")
		{
			update_code(event,current_commitId)
			.then(attack_tools.attack)
			.then(function (vulnerabilities) {
				return filter_results.filter_vulnerabilities(event,current_commitId,parent_commitId,vulnerabilities);
			})
			.then(filtered_vulnerabilities_list => {
				console.log(" ---------------- CHECKING vulnerabilities LIST -------------");
				console.log(filtered_vulnerabilities_list);
				resolve(filtered_vulnerabilities_list);
			})
			.catch(error => reject(error));
		}

		if(event=="email_request")
		{
			filter_results.get_recent_vulnerabilities().then(resolve);
		}


	});

}



function update_code(event_type,curr_hash)
{


	return new Promise(function (resolve, reject) {
		console.log('entered update_code');
		repositoryInfo = JSON.parse(data);
  		console.log(repositoryInfo);
  		// var directory=repositoryInfo[1].repo_directory;
  		var directory = repositoryInfo.directory;
  		var path=repositoryInfo.repo_path;
  		var jenkins_path=repositoryInfo.jenkins_path;

		if(event_type=="push")
		{
			var cmd ='sh commit_update.sh' + ' ' + curr_hash + ' ' +directory+' '+ path + ' ' + jenkins_path;
			console.log(cmd);
			exec(cmd, function (error, stdout, stderr)
    		{
				console.log('inside function');
        		if (error) // There was an error executing our script
        		{
						console.log('-----------------std error');
        				console.log(error);
            			reject("Invalid Request");
        		}
        		else
        		{
							console.log('-----------------success');
						resolve("success");
				}
    		});

		}

		if(event_type=="pull_request")
		{
			var cmd = 'sh pull_request_update.sh' + ' ' + curr_hash + ' ' +directory+' '+ path + ' ' + jenkins_path;
			console.log(cmd);
			exec(cmd, function (error, stdout, stderr)
    		{
        		if(error) // There was an error executing our script
        		{
						console.log('----------------- error');
						console.log(stderr);
            console.log(error);
						reject("error");
							// callback(error);
        		}
        		else
        		{
					console.log("success");
					resolve("success");
				}
        	// callback('success');

    		});
		}

	});
}

module.exports = {
	handle_event
}
