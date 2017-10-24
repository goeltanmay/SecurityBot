var data = fs.readFileSync('./conf.json'),repositoryInfo;
var zap_attack_service=require('./zap_attack.js');
const Promise = require('bluebird');


function attack()
{
	repositoryInfo=JSON.parse(data);
	return new Promise( function(resolve, reject) {
		if("zap" in repositoryInfo.attack_list){
			zap_attack_service.attack_using_zap.then(vulnerabilities => resolve(vulnerabilities));
		}
	});
}