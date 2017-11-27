var fs=require('fs');
// var data = fs.readFileSync('./conf.json'),repositoryInfo;
var attack_tools=require('./attack_tools.js')
var filter_results=require('./filter_results.js');
var sys  = require('util');
var exec = require('child_process').exec;

const Promise = require('bluebird');

function handle_event(event, detail, current_commitId, parent_commitId,repo_name)
{
	return new Promise(function(resolve,reject){

		//console.log("handle_event called");

		if(event==="push" || event ==="pull_request"||event==="installation_repositories")
		{
			update_code(event,detail,current_commitId)
			.then(attack_tools.attack)
			.then(vulnerabilities => filter_results.filter_vulnerabilities(event,detail,current_commitId,parent_commitId,vulnerabilities))
			.then(filtered_vulnerabilities_list => resolve(filtered_vulnerabilities_list))
			.catch(error => reject("Invalid Request"));
		}

		if(event=="email_request")
		{
			filter_results.get_recent_vulnerabilities().then(resolve);
		}


	});

}



function update_code(event_type,detail,curr_hash)
{


	return new Promise(function (resolve, reject) {
		console.log('entered update_code');
		// repositoryInfo = JSON.parse(data);
  	// 	console.log(repositoryInfo);
  		// var directory=repositoryInfo[1].repo_directory;
  		var directory = process.env.directory;
  		var path=process.env.repo_path;
  		var jenkins_path=process.env.jenkins_path;
	    var repo_name=process.env.repo_name;
			// console.log('directory:'+directory);
			// console.log('path:'+path);
			// console.log('jenkins_path:'+jenkins_path);


    var cmd = 'sh zap_process.sh'+' '+process.env.zap_key;

		exec(cmd, function (error, stdout, stderr)
			{
				console.log('stdout: ' + stdout);
				console.log('stderr: '+stderr);
			  console.log('inside functio');
					if (error) // There was an error executing our script
					{
					console.log('-----------------std error');
							console.log(stderr);
								reject(stderr);
					}
			});


		if(event_type=="push")
		{
			console.log("inside push");
			var cmd ='sh commit_update.sh' + ' ' + curr_hash + ' ' +directory+' '+ path + ' ' + jenkins_path+' '+repo_name;
			console.log('-------'+cmd);
			exec(cmd, function (error, stdout, stderr)
    		{
					console.log('stdout: ' + stdout);
					console.log('stderr: '+stderr);
				console.log('inside functio');
        		if (error) // There was an error executing our script
        		{
						console.log('-----------------std error');
        				console.log(stderr);
            			reject(stderr);
        		}
        		else
        		{
						resolve("success");
				}
    		});

		}

		if(event_type=="pull_request")
		{
			var cmd = 'sh pull_request_update.sh' + ' ' + detail + ' ' +directory+' '+ path + ' ' + jenkins_path+' '+repo_name;
			console.log(cmd);
			exec(cmd, function (error, stdout, stderr)
    		{
    			console.log('error------------'+error);
        		if(error) // There was an error executing our script
        		{
						console.log('-----------------std error: '+stderr);
            			// console.log(stderr);
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
		}else if(event_type=='installation_repositories'){
			var cmd = 'sh inst_repo.sh' + ' ' + path + ' ' + jenkins_path+' '+repo_name;
			console.log(cmd);
			exec(cmd, function (error, stdout, stderr)
    		{
    			console.log('error------------'+error);
        		if(error) // There was an error executing our script
        		{
						console.log('-----------------std error: '+stderr);
            			// console.log(stderr);
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
