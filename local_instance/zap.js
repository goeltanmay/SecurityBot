const request = require('request');
var fs=require('fs');
var data = fs.readFileSync('./conf.json'),repositoryInfo;
attack_using_zap("beafb5d30989f2edbe1fde03669eeca08a6444e3","98e5632f502b1bac382e810ec51433215039eddf");

//http://localhost:9000/JSON/spider/action/scan/?zapapiformat=JSON&apikey=obu7ogg851bnrel71kgr4pulca&formMethod=GET&url=http%3A%2F%2Flocalhost%3A8083%2FPatientsApp%2F&maxChildren=&recurse=true&contextName=&subtreeOnly=

//http://localhost:9000/JSON/spider/view/status/?zapapiformat=JSON&apikey=obu7ogg851bnrel71kgr4pulca&formMethod=GET&scanId=3
function attack_using_zap(curr_hash,prev_hash){
	var nock = require('nock');
	repositoryInfo = JSON.parse(data);
	var repo_url=repositoryInfo.repo;
	var zap_url=repositoryInfo.zap_url;
	var key=repositoryInfo.zap_key;
	if(toggle){
		var mockService = nock(zap_url)
	   .get("JSON/spider/action/scan/?zapapiformat=JSON&apikey="+key+"&formMethod=GET&url="+repo_url+"&recurse=true")
	   .reply(200, JSON.stringify({"name":"repo"}) );
		 const request = require('request');
		 request.get("https://api.github.com/users/testuser/repos",(error,response,body) => {
					console.log(body);
				});
	}else{
		var mockService = nock(zap_url)
	   .get("JSON/spider/action/scan/?zapapiformat=JSON&apikey="+key+"&formMethod=GET&url="+repo_url+"&recurse=true")
	   .reply(200, JSON.stringify({"name":"repo"}) );
		 const request = require('request');
		 request.get("https://api.github.com/users/testuser/repos",(error,response,body) => {
					console.log(body);
				});
	}
}
// function attack_using_zap(curr_hash,prev_hash)
// {
// 	repositoryInfo = JSON.parse(data);
// 	var repo_url=repositoryInfo.repo;
// 	var zap_url=repositoryInfo.zap_url;
// 	var key=repositoryInfo.zap_key;
// 	var attack_url=zap_url+"JSON/spider/action/scan/?zapapiformat=JSON&apikey="+key+"&formMethod=GET&url="+repo_url+"&recurse=true";
// 	console.log(attack_url);
// 	request.get(attack_url,(error,response,body) => {
// 		console.log(body);
// 		var body_content = JSON.parse(body);
// 		scanid=body_content.scan;
// 		console.log(scanid);
// 		var status_url=zap_url+"JSON/spider/view/status/?zapapiformat=JSON&apikey="+key+"&formMethod=GET&scanId="+scanid;
// 		var progress="0";
// 		var completed=false;
// 			console.log(status_url);
// 			request.get(status_url,(error,response,body)=>{
// 				progress=JSON.parse(body).status;
// 				console.log(progress);
// 				var alert_url=zap_url+"JSON/core/view/alerts/?zapapiformat=JSON&apikey="+key+"&formMethod=GET&baseurl="+repo_url;
// 				request.get(alert_url,(error,response,body)=>{
// 						// console.log(body);
// 						var vuls = JSON.parse(body);
// 						var alerts = vuls.alerts;
// 						alerts.forEach(function processAlert(alert){
// 							console.log("------------------------------------------------------");
// 							console.log(alert);
// 						})
// 				});
// 			});
// 	});
// }
//

//This method is used to checkout latest code using commit hash
function update_code(event_type, curr_hash, prev_hash){
	console.log('entered update_code');
	repositoryInfo = JSON.parse(data);
  console.log(repositoryInfo);
  // var directory=repositoryInfo[1].repo_directory;
	var directory = ' ';
  var path=repositoryInfo.repo_path;

	if(event_type=='commit')
	{
		var cmd = '‪sh commit_update.sh' + ' ' + event_detail + ' ' + directory + ' ' + path + ' ' + repositoryInfo.jenkins_path;
		var myscript = exec(cmd, function (error, stdout, stderr)
    	{
        	if (error!==null) // There was an error executing our script
        	{
        		console.log(error);
            	return "bad";
        	}
        	console.log("I am here");
        	console.log(stdout);
        	return "good";

    	});

	}
	else
	{
		child = exec('sh ../repo/scripts_local_updates/commit_update.sh '+event_detail, function (error, stdout, stderr)
    	{
        	if (error) // There was an error executing our script
        	{
            	return "bad";
        	}

        	return "good";

    	});
	}

}
