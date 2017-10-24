var fs=require('fs');
var data = fs.readFileSync('./conf.json'),repositoryInfo;
var zap_attack_service=require('./zap_attack.js');
const Promise = require('bluebird');


function attack()
{
	repositoryInfo=JSON.parse(data);
	return new Promise( function(resolve, reject) {
		
		//console.log("attack called");

		
			zap_attack_service.attack_using_zap().then(vulnerabilities => resolve(vulnerabilities));
		
	});
}


module.exports = {
	attack
}