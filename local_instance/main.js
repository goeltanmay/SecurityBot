var fs=require('fs');
// var data = fs.readFileSync('./server/config/config.json'),repositoryInfo;
// var fs=require('fs');
var data = fs.readFileSync('./conf.json'),repositoryInfo;
const request = require('request');
var sys  = require('util');
var exec = require('child_process').exec;

var user_name="goeltanmay";
var repo_name="mesosphere_challenge";
// var repo_path="E:/MS_NCSU/ThirdSemester/SecurityBot/"+repo_name;
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

update_code("commit","beafb5d30989f2edbe1fde03669eeca08a6444e3");
