var fs=require('fs');
//var zap=require('./zap.js');
const Promise = require('bluebird');
// var data = fs.readFileSync('./server/config/config.json'),repositoryInfo;
// var fs=require('fs');
var data = fs.readFileSync('./conf.json'),repositoryInfo;
repositoryInfo=JSON.parse(data);
const request = require('request');
var sys  = require('util');
var exec = require('child_process').exec;
var event_handler=require('./event_handler.js');
var user_name=repositoryInfo.user_name;
var repo_name=repositoryInfo.repo_name;


// var repo_path="E:/MS_NCSU/ThirdSemester/SecurityBot/"+repo_name;
var poll_url="http://desolate-fortress-49649.herokuapp.com/api/repos/"+user_name+"/"+repo_name+"/event";

//var poll_url ="https://maps.googleapis.com/maps/api/geocode/json?address=Florence";

var time_interval_in_miliseconds=5000;


	var event_running=false;

	setInterval(function(){

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
					if(response.statusCode==404)
					{
						console.log('Invalid username and repository!!');
						process.exit(1);
					}
					else
					{
						console.log('got an event');
						event_running=true;
						var event = JSON.parse(body);
						console.log(event);
						var type=event.type;
						var current_commitId=event.detail;
						var parent_commitId=event.previous_commit;

						event_handler.handle_event(type,current_commitId,parent_commitId,repo_name)
						.then(function(result){
							console.log('communicate_with...................');
							console.log(result);

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
     										"detail":event.detail,
     										"vulnerabilities":result
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

							event_running=false;
						});
					}
				}
			});
		}
	},time_interval_in_miliseconds);
