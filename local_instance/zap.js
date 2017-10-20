const request = require('request');
var fs=require('fs');
var data = fs.readFileSync('./conf.json'),repositoryInfo;

var repo_url="";
var zap_url="";
var key='obu7ogg851bnrel71kgr4pulca';


testing_zap();

//http://localhost:9000/JSON/spider/action/scan/?zapapiformat=JSON&apikey=obu7ogg851bnrel71kgr4pulca&formMethod=GET&url=http%3A%2F%2Flocalhost%3A8083%2FPatientsApp%2F&maxChildren=&recurse=true&contextName=&subtreeOnly=

//http://localhost:9000/JSON/spider/view/status/?zapapiformat=JSON&apikey=obu7ogg851bnrel71kgr4pulca&formMethod=GET&scanId=3

function testing_zap()
{
	repositoryInfo = JSON.parse(data);
	repo_url=repositoryInfo.repo;
	zap_url=repositoryInfo.zap_url;

	var attack_url=zap_url+"JSON/spider/action/scan/?zapapiformat=JSON&apikey="+key+"&formMethod=GET&url="+repo_url+"&recurse=true";

	console.log(attack_url);

	request.get(attack_url,(error,response,body) => {
		console.log(body);
		console.log("inside testing_zap1");
		var body_content = JSON.parse(body);
		scanid=body_content.scan;
		console.log(scanid);
		var status_url=zap_url+"JSON/spider/view/status/?zapapiformat=JSON&apikey="+key+"&formMethod=GET&scanId="+scanid;

		var progress="0";

		var completed=false;

			console.log(status_url);
			request.get(status_url,(error,response,body)=>{

				progress=JSON.parse(body).status;
				console.log(progress);


				var alert_url=zap_url+"JSON/core/view/alerts/?zapapiformat=JSON&apikey="+key+"&formMethod=GET&baseurl="+repo_url;

				request.get(alert_url,(error,response,body)=>{
						// console.log(body);
						var vuls = JSON.parse(body);
						var alerts = vuls.alerts;
						alerts.forEach(function processAlert(alert){
							console.log("------------------------------------------------------");
							console.log(alert);
						})
				});

			});

	});
}
