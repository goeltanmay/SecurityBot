var attack_tools=require('./attack_tools.js')
const Promise = require('bluebird');

function handle_event(event, current_commitId, parent_commitId,repo_name)
{
	return new Promise(function(resolve,reject){

		if(event=="push" || event =="pull_request"||event="installation_repository")
		{
			update_code(event,current_commitId).then(attack_tools.attack).then(function(vulnerabilities_list))
			.then(filtered_vulnerabilities_list => resolve(filtered_vulnerabilities_list))
			.catch(error => console.log(error));
		}

		if(event=="email_request")
		{
			report_vulnerabilities(type,repo_name).then(resolve);
		}

	});
	
	/*
	return new Promise(function (resolve, reject) {
		update_code(currentHash)
		.then(zap.attack)
		.then(function(vulnerabilities_list){
			return filter_vulnerabilities(vulnerabilities_list, currentHash, previousHash);
		})
		.then(vulnerabilities_list => resolve(vulnerabilities_list))
		.catch(error => console.log(error));
	});
	*/
}

function report_vulnerabilities(type,repo_name){
	return new Promise(function(resolve,reject){
			resolve("last_five_vulnerabilities");
	});
}

function filter_vulnerabilities(vulnerabilities,current_commitId,parent_commitId){
	return new Promise(function(resolve,reject){
		resolve(vulnerabilities);
	})
}


function update_code(event,currentHash)
{


	return new Promise(function (resolve, reject) {
		// body...
		
		if(event=="push")
		{

		}

		if(event=="pull_request")
		{

		}

		setTimeout(function() {
    		resolve();	
		}, 3000);

		/*
		if()
			resolve();
		else
			reject("Code Not updated properly");
		*/

	});
}

module.exports = {
	handle_event
}