const request = require('request');
var fs=require('fs');
var data = fs.readFileSync('./conf.json'),repositoryInfo;

const Promise = require('bluebird');



function attack_using_zap()
{
	return new Promise( function(resolve,reject)
	{


		repositoryInfo = JSON.parse(data);
		var repo_url=process.env.repo;
		var zap_url=process.env.zap_url;

		var key=process.env.zap_key;
		console.log('key---'+key);

		console.log("I am zap service");


		var attack_url=zap_url+"/JSON/spider/action/scan/?zapapiformat=JSON&apikey="+key+"&formMethod=GET&url="+repo_url+"&recurse=true";


		request.get(attack_url,(error,response,body) => {
			console.log('-----------------------body:');
			console.log(body);
			console.log('-----------------------body:');
			var body_content = JSON.parse(body);

			scanid=body_content.scan;

			var status_url=zap_url+"/JSON/spider/view/status/?zapapiformat=JSON&apikey="+key+"&formMethod=GET&scanId="+scanid;
			var progress="0";
			var completed=false;

			request.get(status_url,(error,response,body)=>{
				progress=JSON.parse(body).status;

				var alert_url=zap_url+"/JSON/core/view/alerts/?zapapiformat=JSON&apikey="+key+"&formMethod=GET&baseurl="+repo_url;
				request.get(alert_url,(error,response,body)=>{

						var vulnerability_list = JSON.parse(body);
						vulnerabilities = vulnerability_list.alerts;

						resolve(vulnerabilities);

						});
				});
			});
	});

}


module.exports = {
	attack_using_zap
}
