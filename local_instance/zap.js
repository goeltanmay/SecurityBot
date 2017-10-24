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
				// console.log('----------------');
				// console.log(old_vul);

				var obj = [];
				var index=0;
				for(element in vulnerabilities){
					var vul = vulnerabilities[element];
					console.log(vul.name);
					if(_isContains(old_vul,vul.name)){
						//vulnerability is not new
					}else{
						obj[index]=vul;
					}
				}
				console.log(obj);
				filtered_vulnerabilities = obj;
			});
		}
	}
	callback(filtered_vulnerabilities);
}


// filter_vulnerabilities('commit','123','121',
// [
//  { "sourceid": "3",
// 		"other": "The X-XSS-Protection HTTP response header allows the web server to enable or disable the web browser's XSS protection mechanism. The following values would attempt to enable it: \nX-XSS-Protection: 1; mode=block\nX-XSS-Protection: 1; report=http://www.example.com/xss\nThe following values would disable it:\nX-XSS-Protection: 0\nThe X-XSS-Protection HTTP response header is currently supported on Internet Explorer, Chrome and Safari (WebKit).Note that this alert is only raised if the response body could potentially contain an XSS payload (with a text-based content type, with a non-zero length).",
// 		"method": "GET",
// 		"evidence": "",
// 		"pluginId": "10016",
// 		"cweid": "933",
// 		"confidence": "Medium",
// 		"wascid": "14",
// 		"description": "Web Browser XSS Protection is not enabled, or is disabled by the configuration of the 'X-XSS-Protection' HTTP response header on the web server",
// 		"messageId": "1",
// 		"url": "http://localhost:8083/PatientsApp/",
// 		"reference": "https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet https://blog.veracode.com/2014/03/guidelines-for-setting-security-headers/",
// 		"solution": "Ensure that the web browser's XSS filter is enabled, by setting the X-XSS-Protection HTTP response header to '1'.",
// 		"alert": "Web Browser XSS Protection Not Enabled",
// 		"param": "X-XSS-Protection",
// 		"attack": "",
// 		"name": "Web Browser XSS Protection Not Enabled",
// 		"risk": "Low",
// 		"id": "0" },
// 	{ "sourceid": "3",
// 		"other": "This issue still applies to error type pages (401, 403, 500, etc) as those pages are often still affected by injection issues, in which case there is still concern for browsers sniffing pages away from their actual content type.At 'High' threshold this scanner will not alert on client or server error responses.",
// 		"method": "GET",
// 		"evidence": "",
// 		"pluginId": "10021",
// 		"cweid": "16",
// 		"confidence": "Medium",
// 		"wascid": "15",
// 		"description": "The Anti-MIME-Sniffing header X-Content-Type-Options was not set to 'nosniff'. This allows older versions of Internet Explorer and Chrome to perform MIME-sniffing on the response body, potentially causing the response body to be interpreted and displayed as a content type other than the declared content type. Current (early 2014) and legacy versions of Firefox will use the declared content type (if one is set), rather than performing MIME-sniffing.",
// 		"messageId": "1",
// 		"url": "http://localhost:8083/PatientsApp/",
// 		"reference": "http://msdn.microsoft.com/en-us/library/ie/gg622941%28v=vs.85%29.aspx https://www.owasp.org/index.php/List_of_useful_HTTP_headers",
// 		"solution": "Ensure that the application/web server sets the Content-Type header appropriately, and that it sets the X-Content-Type-Options header to 'nosniff' for all web pages. If possible, ensure that the end user uses a standards-compliant and modern web browser that does not perform MIME-sniffing at all, or that can be directed by the web application/web server to not perform MIME-sniffing.",
// 		"alert": "X-Content-Type-Options Header Missing",
// 		"param": "X-Content-Type-Options",
// 		"attack": "",
// 		"name": "X-Content-Type-Options Header Missing",
// 		"risk": "Low",
// 		"id": "1" },
// 		{ "sourceid": "3",
// 			"other": "",
// 			"method": "GET",
// 			"evidence": "",
// 			"pluginId": "10020",
// 			"cweid": "16",
// 			"confidence": "Medium",
// 			"wascid": "15",
// 			"description": "X-Frame-Options header is not included in the HTTP response to protect against 'ClickJacking' attacks.",
// 			"messageId": "1",
// 			"url": "http://localhost:8083/PatientsApp/",
// 			"reference": "http://blogs.msdn.com/b/ieinternals/archive/2010/03/30/combating-clickjacking-with-x-frame-options.aspx",
// 			"solution": "Most modern Web browsers support the X-Frame-Options HTTP header. Ensure it's set on all web pages returned by your site (if you expect the page to be framed only by pages on your server (e.g. it's part of a FRAMESET) then you'll want to use SAMEORIGIN, otherwise if you never expect the page to be framed, you should use DENY. ALLOW-FROM allows specific websites to frame the web page in supported web browsers).",
// 			"alert": "X-Frame-Options Header Not Set",
// 			"param": "X-Frame-Options",
// 			"attack": "",
// 			"name": "X-Frame-Options Header Not Set",
// 			"risk": "Medium",
// 			"id": "2" }
// 	],function(vuls){console.log('');})

// filter_vulnerabilities('commit',null,null,{'yo':'bitch','sec':'2nd vul'},function(vuls){console.log('');})

//This method is required to check if JSON object contains a value
function _isContains(json, value) {
    let contains = false;
    Object.keys(json).some(key => {
        contains = typeof json[key] === 'object' ? _isContains(json[key], value) : json[key] === value;
         return contains;
    });
    return contains;
 }

//This method shall return recent vulnerabilities from last 5 commits
 function get_recent_vulnerabilities(){
	 console.log('inside get_recent_vulnerabilities');
	 var result = [];
	 vuls = Vulnerability.findAll({
		 limit:5,
		 where:{},
		 order:[['createdAt', 'DESC']]
	 }).then(function(lists){
		 var index=0;
		 for(list in lists){
			 var vulnerabilities = lists[list].zap_result;
			 for(v in vulnerabilities){
				//  console.log('--------------');
				 var vul = vulnerabilities[v];
				 if(_isContains(result,vul.name)){
					 //vulverability isn't new
				 	}else{
						//new vulverability, added in result
				 		result[index++]=vul;
				 	}
			 }
			 console.log('result is---------------');
			 console.log(result);
		 }
	 });
 }
// get_recent_vulnerabilities();

exports.attack_using_zap=attack_using_zap;
exports.filter_vulnerabilities=filter_vulnerabilities;
