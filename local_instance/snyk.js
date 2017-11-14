const request = require('request');
var fs=require('fs');
var data = fs.readFileSync('./conf.json'),repositoryInfo;
const Promise = require('bluebird');
var sys  = require('util');
var exec = require('child_process').exec;

function snyk_scan()
{
	return new Promise(function(resolve,reject){

		console.log('parsing data-------------');
		console.log(data);
		var data = fs.readFileSync('./conf.json'),repositoryInfo;
			repositoryInfo = JSON.parse(data);
			console.log('parsed data');

			//console.log(process.env.snyk_api_token);
			//console.log(repositoryInfo.snyk_url);
			console.log("i am in snyk service");
			var cmd ='sh snyk.sh' +' '+process.env.snyk_api_token+' '+repositoryInfo.snyk_url;
			console.log(cmd);
			exec(cmd, function (error, stdout, stderr)
    		{
				//console.log('inside function snyk_scan');
        		if (stderr) // There was an error executing our script
        		{
						//console.log('-----------------std error');
        				//console.log(stderr);
            			reject("Invalid Request");
        		}
        		else
        		{
        				//console.log(stdout);
        				data=JSON.parse(stdout);

						resolve(data.vulnerabilities);
				}
    		});

    		//resolve("success");

	});
}

module.exports = {
	snyk_scan
}
