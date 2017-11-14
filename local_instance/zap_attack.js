const request = require('request');
var fs=require('fs');
var data = fs.readFileSync('./conf.json'),repositoryInfo;
var nock = require("nock");
var zap_mock_data = fs.readFileSync('./mock_data_zap.json');
zap_mock_data=JSON.parse(zap_mock_data);
const Promise = require('bluebird');



function attack_using_zap()
{
	return new Promise( function(resolve,reject)
	{
		
		
		repositoryInfo = JSON.parse(data);
		var repo_url=repositoryInfo.repo;
		var zap_url=repositoryInfo.zap_url;
		
		var key=process.env.zap_key;
		console.log(key);

		console.log("I am zap service");


		//var attack_url_service=nock("http://localhost:9000").get("/JSON/spider/action/scan/?zapapiformat=JSON&apikey="+key+"&formMethod=GET&url="+repo_url+"&recurse=true").reply(200,JSON.stringify(zap_mock_data.scanId));
		//var status_url_service=nock("http://localhost:9000").get("/JSON/spider/view/status/?zapapiformat=JSON&apikey="+key+"&formMethod=GET&scanId="+"1").reply(200,JSON.stringify(zap_mock_data.progress));
		//var alert_url_service=nock("http://localhost:9000").get("/JSON/core/view/alerts/?zapapiformat=JSON&apikey="+key+"&formMethod=GET&baseurl="+repo_url).reply(200,JSON.stringify(zap_mock_data.vulnerabilities));

		var attack_url=zap_url+"/JSON/spider/action/scan/?zapapiformat=JSON&apikey="+key+"&formMethod=GET&url="+repo_url+"&recurse=true";
	
	

		
		
		request.get(attack_url,(error,response,body) => {
			
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