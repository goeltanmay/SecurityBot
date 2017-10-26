# SecurityBot

This is a Github bot to make security testing even more automated and easily accessible. This project is a part of the CSC-510 Software Engineering course at NC State,

### Team Members
* Jitin Kumar (jkumar3)
* Palak Agrawal (pagrawa2)
* Sachin Ahuja (sahuja3)
* Tanmay Goel (tgoel)

### Bot Design

The detailed design document can be found at [Design](DESIGN.md) page.

### Bot Milestone

#### Documentation for BOT Milestone

The detailed document containing description about the application flow, the design patterns, mocking and selenium testing can be found in [BOT](https://github.com/goeltanmay/SecurityBot/blob/master/BOT.md) page.

#### Instructions to Run the Application

Our complete application is divided into two parts: Server Hosted Bot Application and Local Bot Application. The server hosted bot listens to GitHub events and extracts detail about these events. When a local bot polls to the server bot it delegates the event to local instance. Local instance then runs the penetration testing and returns the set of vulnerabilities as a result to server bot. The server bot raises an issue, comments on push and pull requests, or sends an email depending upon the type of event it received from the GitHUb.

##### Instruction to set up the Server Bot

Server bot is already deployed on [heroku](http://desolate-fortress-49649.herokuapp.com/emailReport). You can test it live on heroku.

##### Instruction to set up Local Bot

1. Clone the [PatientsApp](https://github.com/goeltanmay/PatientsApp.git) repository from github.

2. Install jenkins.....(jitin write further steps here)


2. After performing the above steps, make the changes in the conf.json to change the tomcat URL of patient app in repo, Jenkins URL, path at which PatientsApp is cloned as repo_path, the zap url, jenkins path to jenkins-cli.jar.
