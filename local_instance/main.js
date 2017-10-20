var fs=require('fs');
var data = fs.readFileSync('./server/config/config.json'),repositoryInfo;
const request = require('request');
var sys  = require('util');
var exec = require('child_process').exec;

var user_name="goeltanmay";
var repo_name="mesosphere_challenge";
var repo_path="E:/MS_NCSU/ThirdSemester/SecurityBot/"+repo_name;
var poll_url="http://desolate-fortress-49649.herokuapp.com/api/repos/"+user_name+"/"+repo_name+"/event";

//var poll_url ="https://maps.googleapis.com/maps/api/geocode/json?address=Florence";
/*
var time_interval_in_miliseconds=5000;


	var event_running=false;

	setInterval(function(){
		console.log('polling started');
		if(!event_running){
			request.get(poll_url,(error,response,body) => {
				if(error)
				{
					console.log('Error occured while polling'+error);
				}
				else
				{
					if(response.statusCode==204)
					{
						console.log('No event to handle');
					}
					else
					{
						console.log('got an event');
						event_running=true;
						var event = JSON.parse(body);
						console.log(event.type);
						console.log(event.detail);
						update_code(event.type,event.detail,function(result){
								if(result=="good")
								{
									console.log("done executing relevant script");
								}
								else
								{
									console.log("problem in executing the script");	
								}	
								event_running=false;
						});
					}
				}
			});
		}
	},time_interval_in_miliseconds);

*/

update_code("commit","7361a36883b69696b4389fa3740430163d28ba64");

function update_code(event_type,event_detail)
{
	console.log('entered update_code');
	repositoryInfo = JSON.parse(data);
    console.log(repositoryInfo);
    var directory=repositoryInfo[1].repo.repo_directory;
    var path=repositoryInfo[1].repo.repo_path;
	if(event_type=='commit')
	{
		//console.log('"commit_update.sh" '+event_detail+' '+directory+' '+path);
		exec('‪commit_update.sh '+event_detail+' '+directory+' '+path, function (error, stdout, stderr) 
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