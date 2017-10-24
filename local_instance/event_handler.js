var attack_tools=require('./attack_tools.js')
var filter_results=require('./filter_results.js');
const Promise = require('bluebird');

function handle_event(event, current_commitId, parent_commitId,repo_name)
{
	return new Promise(function(resolve,reject){

		//console.log("handle_event called");

		if(event==="push" || event ==="pull_request"||event==="installation_repository")
		{
			update_code(event,current_commitId)
			.then(attack_tools.attack)
			.then(vulnerabilities => filter_results.filter_vulnerabilities(event,current_commitId,parent_commitId,vulnerabilities))
			.then(filtered_vulnerabilities_list => resolve(filtered_vulnerabilities_list))
			.catch(error => reject("Invalid Request"));
		}

		if(event=="email_request")
		{
			filter_results.get_recent_vulnerabilities().then(resolve);
		}
		

	});
	
}



function update_code(event,current_commitId)
{


	return new Promise(function (resolve, reject) {
		// body...
		
		if(event==="push")
		{

		}

		if(event==="pull_request")
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