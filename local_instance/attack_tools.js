var fs=require('fs');
var data = fs.readFileSync('./conf.json'),repositoryInfo;
var zap_attack_service=require('./zap_attack.js');
var snyk_service = require('./snyk.js');
const Promise = require('bluebird');

attack().then(function(vulnerabilities){
	console.log(vulnerabilities[0]);
	console.log(vulnerabilities[1]);
});

function attack()
{
	repositoryInfo=JSON.parse(data);
	return new Promise( function(resolve, reject) {
		
		//console.log("attack called");

		
			zap_attack_service.attack_using_zap().then(function(zap_vulnerabilities){
				snyk_service.snyk_scan().then(function(snyk_vulnarabilities){
					//console.log(snyk_vulnarabilities);
					//console.log(zap_vulnerabilities);
					resolve([zap_vulnerabilities,snyk_vulnarabilities]);
				});
			});
		
	});
}


module.exports = {
	attack
}