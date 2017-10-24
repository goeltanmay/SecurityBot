const request = require('request');
var fs=require('fs');
var data = fs.readFileSync('./conf.json'),repositoryInfo;
var nock = require("nock");
var zap_mock_data = fs.readFileSync('./mock_data_zap.json');
const Promise = require('bluebird');
//var zap_mock_data=JSON.parse(mock_data);

attack_using_zap("push","cc355a4b093efbcdb1c73a28ba2caa9d276cf1c4","98e5632f502b1bac382e810ec51433215039eddf");
//http://localhost:9000/JSON/spider/action/scan/?zapapiformat=JSON&apikey=obu7ogg851bnrel71kgr4pulca&formMethod=GET&url=http%3A%2F%2Flocalhost%3A8083%2FPatientsApp%2F&maxChildren=&recurse=true&contextName=&subtreeOnly=

//http://localhost:9000/JSON/spider/view/status/?zapapiformat=JSON&apikey=obu7ogg851bnrel71kgr4pulca&formMethod=GET&scanId=3


function attack_using_zap()
{
	return new Promise( function(resolve,reject)
	{
		repositoryInfo = JSON.parse(data);
		var repo_url=repositoryInfo.repo;
		var zap_url=repositoryInfo.zap_url;
		var key=repositoryInfo.zap_key;


		var attack_url_service=nock("http://localhost:9000").persist().get("/JSON/spider/action/scan/?zapapiformat=JSON&apikey="+key+"&formMethod=GET&url="+repo_url+"&recurse=true").reply(200,JSON.stringify(zap_mock_data.scanId));
		var status_url_service=nock("http://localhost:9000").persist().get("/JSON/spider/view/status/?zapapiformat=JSON&apikey="+key+"&formMethod=GET&scanId="+"1").reply(200,JSON.stringify(zap_mock_data.progress));
		var alert_url_service=nock("http://localhost:9000").persist().get("/JSON/core/view/alerts/?zapapiformat=JSON&apikey="+key+"&formMethod=GET&baseurl="+repo_url).reply(200,JSON.stringify(zap_mock_data.vulnerabilities));

		var attack_url=zap_url+"/JSON/spider/action/scan/?zapapiformat=JSON&apikey="+key+"&formMethod=GET&url="+repo_url+"&recurse=true";
	
	

		console.log(attack_url);
		
		request.get(attack_url,(error,response,body) => {
			console.log(body);
			var body_content = JSON.parse(body);
			console.log(body_content);
			scanid=body_content.scan;
			console.log(scanid);
			var status_url=zap_url+"/JSON/spider/view/status/?zapapiformat=JSON&apikey="+key+"&formMethod=GET&scanId="+scanid;
			var progress="0";
			var completed=false;
			console.log(status_url);
			request.get(status_url,(error,response,body)=>{
				progress=JSON.parse(body).status;
				console.log(progress);
				var alert_url=zap_url+"/JSON/core/view/alerts/?zapapiformat=JSON&apikey="+key+"&formMethod=GET&baseurl="+repo_url;
				request.get(alert_url,(error,response,body)=>{
						// console.log(body);
						var vulnerability_list = JSON.parse(body);
						vulnerabilities = vulnerability_list.alerts;
						console.log(vulnerabilities);
						
						resolve(vulnerabilities);

						});
				});
			});
	});

}