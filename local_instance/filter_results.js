const request = require('request');
var fs=require('fs');
var data = fs.readFileSync('./conf.json'),repositoryInfo;
const Vulnerability = require('./server/models').Vulnerability;

filter_vulnerabilities('commit','125','124',[[
    { "sourceid": "3",
       "other": "The X-XSS-Protection HTTP response header allows the web server to enable or disable the web browser's XSS protection mechanism. The following values would attempt to enable it: \nX-XSS-Protection: 1; mode=block\nX-XSS-Protection: 1; report=http://www.example.com/xss\nThe following values would disable it:\nX-XSS-Protection: 0\nThe X-XSS-Protection HTTP response header is currently supported on Internet Explorer, Chrome and Safari (WebKit).Note that this alert is only raised if the response body could potentially contain an XSS payload (with a text-based content type, with a non-zero length).",
       "method": "GET",
       "evidence": "",
       "pluginId": "10016",
       "cweid": "933",
       "confidence": "Medium",
       "wascid": "14",
       "description": "Web Browser XSS Protection is not enabled, or is disabled by the configuration of the 'X-XSS-Protection' HTTP response header on the web server",
       "messageId": "1",
       "url": "http://localhost:8083/PatientsApp/",
       "reference": "https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet https://blog.veracode.com/2014/03/guidelines-for-setting-security-headers/",
       "solution": "Ensure that the web browser's XSS filter is enabled, by setting the X-XSS-Protection HTTP response header to '1'.",
       "alert": "Web Browser XSS Protection Not Enabled",
       "param": "X-XSS-Protection",
       "attack": "",
       "name": "Web Browser XSS Protection Not Enabled",
       "risk": "Low",
       "id": "0" },
     { "sourceid": "3",
       "other": "This issue still applies to error type pages (401, 403, 500, etc) as those pages are often still affected by injection issues, in which case there is still concern for browsers sniffing pages away from their actual content type.At 'High' threshold this scanner will not alert on client or server error responses.",
       "method": "GET",
       "evidence": "",
       "pluginId": "10021",
       "cweid": "16",
       "confidence": "Medium",
       "wascid": "15",
       "description": "The Anti-MIME-Sniffing header X-Content-Type-Options was not set to 'nosniff'. This allows older versions of Internet Explorer and Chrome to perform MIME-sniffing on the response body, potentially causing the response body to be interpreted and displayed as a content type other than the declared content type. Current (early 2014) and legacy versions of Firefox will use the declared content type (if one is set), rather than performing MIME-sniffing.",
       "messageId": "1",
       "url": "http://localhost:8083/PatientsApp/",
       "reference": "http://msdn.microsoft.com/en-us/library/ie/gg622941%28v=vs.85%29.aspx https://www.owasp.org/index.php/List_of_useful_HTTP_headers",
       "solution": "Ensure that the application/web server sets the Content-Type header appropriately, and that it sets the X-Content-Type-Options header to 'nosniff' for all web pages. If possible, ensure that the end user uses a standards-compliant and modern web browser that does not perform MIME-sniffing at all, or that can be directed by the web application/web server to not perform MIME-sniffing.",
       "alert": "X-Content-Type-Options Header Missing",
       "param": "X-Content-Type-Options",
       "attack": "",
       "name": "X-Content-Type-Options Header Missing",
       "risk": "Low",
       "id": "1" },
     { "sourceid": "3",
       "other": "",
       "method": "GET",
       "evidence": "",
       "pluginId": "10020",
       "cweid": "16",
       "confidence": "Medium",
       "wascid": "15",
       "description": "X-Frame-Options header is not included in the HTTP response to protect against 'ClickJacking' attacks.",
       "messageId": "1",
       "url": "http://localhost:8083/PatientsApp/",
       "reference": "http://blogs.msdn.com/b/ieinternals/archive/2010/03/30/combating-clickjacking-with-x-frame-options.aspx",
       "solution": "Most modern Web browsers support the X-Frame-Options HTTP header. Ensure it's set on all web pages returned by your site (if you expect the page to be framed only by pages on your server (e.g. it's part of a FRAMESET) then you'll want to use SAMEORIGIN, otherwise if you never expect the page to be framed, you should use DENY. ALLOW-FROM allows specific websites to frame the web page in supported web browsers).",
       "alert": "X-Frame-Options Header Not Set",
       "param": "X-Frame-Options",
       "attack": "",
       "name": "X-Frame-Options Header Not Set",
       "risk": "Medium",
       "id": "2" }
     ] ,[]])

function filter_vulnerabilities(type,cur_hash,pre_hash,vulnerabilities){
	console.log('inside filter_vulnerabilities');

	return new Promise(function(resolve, reject) {
		Vulnerability.create({
					curr_hash: cur_hash,
					prev_hash: pre_hash,
					zap_result: vulnerabilities[0],
					snyk_result: vulnerabilities[1]
				}).then(task => {
					// you can now access the newly created task via the variable task
					if (type === 'installation_repositories')
						resolve(vulnerabilities);
					else if (pre_hash == null || pre_hash==='0000000000000000000000000000000000000000'){
						resolve(vulnerabilities);
					} else {
						Vulnerability.findOne({where: {curr_hash: pre_hash,},}).then(vul => {
						if(vul==null){
							resolve(vulnerabilities);
						}

						var obj = [];
						old_vul = vul.zap_result;
						var counter = 0;
						var index=0;
						var all_promises=[];
						for(element in vulnerabilities[0]){
							console.log('element-------');
							console.log(element);
							counter++;
							var vul = vulnerabilities[0][element];
							if(_isContains(old_vul,vul.name)){
								//vulnerability is not new
							}else{
								obj[index++]=vul;
							}
							if (counter == vulnerabilities[0].length){
								console.log('result---------------');
								console.log(obj);
								resolve(obj);
							}
						}
				});
			}
	});

	 });
 }

 function _isContains(json, value) {
     let contains = false;
     Object.keys(json).some(key => {
         contains = typeof json[key] === 'object' ? _isContains(json[key], value) : json[key] === value;
          return contains;
     });
     return contains;
}

function get_recent_vulnerabilities(){
 	return new Promise(function(resolve,reject){

 				console.log('inside get_recent_vulnerabilities');
	 			var result = [];
	 			vuls = Vulnerability.findAll({
		 			limit:5,
		 			where:{},
		 			order:[['createdAt', 'DESC']]
	 			}).then(function(lists){
		 			var index=0;
					var counter1 = 0;

		 			for(list in lists){
			 				var vulnerabilities = lists[list].zap_result;
							var counter2 = 0;
							counter1++;
			 				for(v in vulnerabilities){
									counter2++;
									//  console.log('--------------');
				 					var vul = vulnerabilities[v];
				 					if(_isContains(result,vul.name)){
					 					//vulverability isn't new
				 					}else{
										//new vulverability, added in result
				 							result[index++]=vul;
				 					}
									if (counter1 == list.length && counter2 == vulnerabilities.length) {
											resolve(result);
									}
			 				}
		 			}
	 			});
 	});
}

 module.exports={
 	filter_vulnerabilities,
	get_recent_vulnerabilities
 }
