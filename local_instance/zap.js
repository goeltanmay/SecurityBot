const request = require('request');
var fs=require('fs');
var data = fs.readFileSync('./conf.json'),repositoryInfo;
var nock = require("nock");
var mock_data = fs.readFileSync('./mock_data_zap.json');
var zap_mock_data=JSON.parse(mock_data);
const Vulnerability = require('./server/models').Vulnerability;

// attack_using_zap("push","cc355a4b093efbcdb1c73a28ba2caa9d276cf1c4","98e5632f502b1bac382e810ec51433215039eddf");
//http://localhost:9000/JSON/spider/action/scan/?zapapiformat=JSON&apikey=obu7ogg851bnrel71kgr4pulca&formMethod=GET&url=http%3A%2F%2Flocalhost%3A8083%2FPatientsApp%2F&maxChildren=&recurse=true&contextName=&subtreeOnly=

//http://localhost:9000/JSON/spider/view/status/?zapapiformat=JSON&apikey=obu7ogg851bnrel71kgr4pulca&formMethod=GET&scanId=3


function attack_using_zap(type,curr_hash,prev_hash)
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
				//console.log(vulnerabilities);
				filter_vulnerabilities(type,curr_hash,prev_hash,vulnerabilities,function(filtered_vulnerabilities)
				{

					console.log(filtered_vulnerabilities);

					var response_url=repositoryInfo.heroku_url+"/report";

					request.post({
						url: response_url,
						headers: {
							"Content-Type": "application/json"
						},
						body:{
							"eventType":type,
							"userId":repositoryInfo.user_name,
							"repoName":repositoryInfo.repo_name,
							"detail":curr_hash,
							"vulnerabilities":filtered_vulnerabilities
						},
						json:true
					}, function(error, response, body){
						if(error)
						{
							console.log(error);
						}
						console.log("sent response");
						//console.log(JSON.parse(body));
					});

				});
			});
		});
	});

}

//this function shall be used to return the new vulnerabilities introduced in a commit/pull request
function filter_vulnerabilities(type,cur_hash,pre_hash,vulnerabilities, callback){
	var filtered_vulnerabilities;
	if(type=='integration'){
		Vulnerability.create({
			curr_hash: cur_hash,
			prev_hash: pre_hash,
			zap_result: vulnerabilities
		}).then(task => {
			// you can now access the newly created task via the variable task
		});
// 	module.exports = {
//   create(req, res) {
//     return Vulnerability
//       .create({
// 				curr_hash: cur_hash,
// 				prev_hash: pre_hash,
// 				zap_result: vulnerabilities
//       })
//       .then(task => {})
//       .catch(error => res.status(400).send(error));
//   },
// };
		filtered_vulnerabilities = vulnerabilities;
	}else{
		Vulnerability.create({
			curr_hash: cur_hash,
			prev_hash: pre_hash,
			zap_result: vulnerabilities
		}).then(task => {
			console.log("All vulnerabilities stored in database");
		});

		if(pre_hash==null){
			filtered_vulnerabilities = vulnerabilities;
		}else{
			console.log('not first commit');
			Vulnerability.findOne({where: {curr_hash: pre_hash,},}).then(vul => {
				old_vul = vul.zap_result;
				var obj = {};
				for(vul in vulnerabilities){
					if(old_vul[vul]){
						//vulnerability isn't new
					}else{
						obj[vul] = vulnerabilities[vul];
					}
				}
				console.log(obj);
				filtered_vulnerabilities = obj;
			});
		}
	}
	callback(filtered_vulnerabilities);
}


filter_vulnerabilities('commit','123','121',{'yo':'bitch','sec':'2nd vul'},function(vuls){console.log('');})
// filter_vulnerabilities('commit',null,null,{'yo':'bitch','sec':'2nd vul'},function(vuls){console.log('');})

exports.attack_using_zap=attack_using_zap;
exports.filter_vulnerabilities=filter_vulnerabilities;
