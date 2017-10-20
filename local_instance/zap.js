const request = require('request');


/*
var options = { proxy:'http://localhost:9000' };
    var ZapClient = require('zaproxy');
    console.log(ZapClient);

    var key='obu7ogg851bnrel71kgr4pulca';
    var zaproxy = new ZapClient(key,options);
    zaproxy.core.sites(function (err, resp) {
    	console.log(err);
      resp.sites.forEach(function (site) {
        	console.log(site);
      });  
    });
*/

var repo_url="http://localhost:8083/PatientsApp/";
var key='obu7ogg851bnrel71kgr4pulca';


testing_zap();

//http://localhost:9000/JSON/spider/action/scan/?zapapiformat=JSON&apikey=obu7ogg851bnrel71kgr4pulca&formMethod=GET&url=http%3A%2F%2Flocalhost%3A8083%2FPatientsApp%2F&maxChildren=&recurse=true&contextName=&subtreeOnly=

//http://localhost:9000/JSON/spider/view/status/?zapapiformat=JSON&apikey=obu7ogg851bnrel71kgr4pulca&formMethod=GET&scanId=3

function testing_zap()
{

	var attack_url="http://localhost:9000/JSON/spider/action/scan/?zapapiformat=JSON&apikey="+key+"&formMethod=GET&url="+repo_url+"&recurse=true";

	console.log(attack_url);

	request.get(attack_url,(error,response,body) => {

		var body_content = JSON.parse(body);
		scanid=body_content.scan;
		console.log(scanid);

		var status_url="http://localhost:9000/JSON/spider/view/status/?zapapiformat=JSON&apikey="+key+"&formMethod=GET&scanId="+scanid;

		var progress="0";

		var completed=false;

			console.log(status_url);
			request.get(status_url,(error,response,body)=>{

				progress=JSON.parse(body).status;
				console.log(progress);


			});
			
//http://localhost:9000/JSON/core/view/alerts/?zapapiformat=JSON&apikey=obu7ogg851bnrel71kgr4pulca&formMethod=GET&baseurl=http%3A%2F%2Flocalhost%3A8083%2FPatientsApp%2F&start=&count=
		
		var alert_url="http://localhost:9000/JSON/core/view/alerts/?zapapiformat=JSON&apikey="+key+"&formMethod=GET&baseurl="+repo_url;

		request.get(alert_url,(error,response,body)=>{

				console.log(body);

		});




	});
}