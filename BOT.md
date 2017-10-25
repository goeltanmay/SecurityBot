# BOT

## Use Cases: (Same as Before)  

Our bot will aid users while performing the following tasks:

1. Check security vulnerabilities of an application when bot is integrated with the repo for the first time
    1. __Preconditions__  
    The repo must have the security bot installed.
    2. __Main Flow__  
     Github signals the bot to check the code present in the repository against any potential vulnerabilities. Bot fetches the code from the repository and runs OWASP ZAP and static analysis tools [S1]. Bot will collect the list of vulnerabilities and raise an issue with the vulnerabilities found [S2].
    3. __Subflows__  
    [S1] - The tools will be picked according to the programming language or framework used.
    [S2] - The issue will be raised with title as <type_of_vulnerability>.
    4. __Alternative Flows__  
    If no vulnerabilities are found, the bot comments that no vulnerability is detected in the code.

2. A developer wants to see all the vulnerabilities introduced in the code because of his commit
    1. __Preconditions__  
     The repo must have the security bot installed.
    2. __Main Flow__  
     One of the developers commits a piece of code. Github signals the bot with the commit id. Bot fetches the code from the commit and runs OWASP ZAP and static analysis tools [S1]. Bot will collect the list of vulnerabilities and post a comment on the commit with the new vulnerabilities found because of it. It also raises an issue with the vulnerabilities found [S2].
    3. __Subflows__  
     [S1] - The tools will be picked according to the programming language or framework used.
     [S2] - The issue will be raised with title as <type_of_vulnerability>.
    4. __Alternative Flows__  
     If no vulnerabilities are found, the bot comments that no vulnerability is detected in the code.

3. A repo collaborator has to check a pull request for vulnerabilities.
      1. __Preconditions__  
       The repo must have the security bot installed.
      2. __Main Flow__  
       Some contributor raises a pull request [S1]. Github signals the bot with the pull request number. Bot fetches the code from the Pull Request and runs OWASP ZAP and static analysis tools. Bot makes comments on the Pull Request, detailing the new vulnerabilities added because of it.
      3. __Subflows__  
       [S1] - The contributor can raise a pull request from another fork, or from one of the branches in the same repo. The bot will analyze both the base and the branch to be merged, and report any differences.
      4. __Alternative Flows__  
       If no vulnerabilities are found, the bot comments that no vulnerability is detected in the code.

4. Get vulnerability report of the day via email
    1. __Preconditions__  
      The repo must have the security bot installed.
    2. __Main Flow__  
      Bot will query the database and fetch list of vulnerabilities from past 5 commits. It sends out an email stating the vulnerabilities found.
    3. __Alternative Flows__  
      If no vulnerabilities are found, the bot sends an email that no vulnerability is detected in the code.

## Mocking  

We used Zed Attack Proxy(ZAP) to perform penetration testing of repository that is registered with our bot application. ZAP operates by running the deployed instance of an application in a browser using proxy to hit the URL's that are part of the application to identify the vulnerabilities that can be potential causes for a network attack.

In this milestone, out aim was to mock the ZAP service instead of actually implementing the service. A primary goal of mocking is to switch between real sources of data and mock data without impacting the implementation of the code. We looked at the rest API's of ZAP to identify the format in which it returns the results. When invoked, it checks for vulnerabilities and returns a list of JSON objects, each of which represents a vulnerability with different attributes such as name, description, etc. We used mock data stored in [ZAP Service mock data](http://google.com) to mock the zap service which contains output in the same format as we identified above.


We also used "nock" library to mock the ZAP Service API calls. "nock" helps us to intercept requests to a URL and instead use the mock data given in the link above. We created a mock object to ZAP service call and directed it to return the results from the mock data. Whenever a local instance which contains the deployed instance receives a request from server hosted bot application which listens to GitHub events, it updates code of the local instance. It then calls ZAP API service which returns the list of vulnerabilities which is sent back to the server bot which performs further action such as raising an issue, commenting to a commit on the GitHub repository depending on the type of request as indicated in the use cases described above.


## Bot Implementation

### Bot Platform

### Bot Integration

Our complete application is divided into two parts: Server Hosted Bot Application and Local Instance Application. The functionalities provided by these sub-applications are explained below:

#### Server Hosted Bot

Server Hosted Bot is responsible for listening to events that occur on repositories that are registered to our application. The bot listens to the four kind of events given below:


1. __Installation and Integration:__  When a repository registers with our bot application, the bot initiates a "installation_repositories" request and hand it over to a local instance which takes care of the request. The local instance performs the penetration testing and returns a list of vulnerabilities. The server bot then creates an issue for the repository and includes all the vulnerabilities as the content of the issue.

2. __Commit Events:__ When a collaborator of the repository using our server bot fires a commit event on GitHub, the server bot initiates a "push" request and hands it over to a local instance responsible to poll events for that repository. The local instance performs penetration testing on the application by first updating the code and then calling the ZAP service. The vulnerabilities obtained are filtered to remove the older vulnerabilities which are stored in MySQL database. These filtered vulnerabilities are then sent back to the server bot which then comments them out on the commit.

3. __Pull Request Events:__ When a collaborator starts a new pull request, the server bot fires a "pull_request" event and gives the request to local instance which then performs penetration testing and returns list of vulnerabilities to the server bot. The server bot comments these vulnerabilities out on the Github.

4. __Report Request:__ A collaborator can request for the report of the penetration testing on the repository by filling a form and giving his email-id and repository name. In this case the bot initiates an "email_request" request and delegates it to the local instance. The local instance then responds with the list of vulnerabilities caused by last five commits. The server bot sends a mail to the collaborator containing the list of vulnerabilities as content.


#### Local Instance

The local instance is built using Layered Architecture. It consists of the following layers:

1. __Communication Layer:__ The communication layer is responsible for communicating with the server hosted bot. It polls the server bot to get any pending requests for the repository it handles. If it receives a request from the server, it calls the event handler layer to initiate the event. It also receives a response from event handler layer which is a list of vulnerabilities and sends it back to the server.

2. __Event Handler Layer:__ The event handler layer initiates the event. It first invokes shell scripts to update the code and deploy it on the server using continuous integration through Jenkins. After updating the code it invokes the attack tool layer to perform penetration testing. It also responds back to the communication layer with the results obtained from the attack tool layer after filtering them to remove old vulnerabilities by calling filtering methods of Database layer.  

3. __Attack Tool Layer:__ The attack tool layer calls different attack services and responds back with the result obtained from services to Event Handler Layer.

4. __Attack Service:__ An attack service is a REST service which performs penetration testing on the repository. For this milestone, our aim was to mock the service. We used nock to mock the ZAP(Zed attack Proxy) service which performs penetration testing on an application by hitting the URL's of the application. It receives mock data as output and gives it back to the Attack Tool Layer.

5. __Database Layer:__ The Database layer is responsible for storing the vulnerabilities obtained from running an attack service. It first receives a list of vulnerabilities from Event Handler Layer for ongoing event and interacts with database to find the old vulnerabilities for the same repository. It then removes the vulnerabilities that are old in the list received from event handler layer. Thus, it sends back filtered vulnerabilities introduced by current event. When a collaborator initiates an "email_request" event, the database layer responds with the vulnerabilities obtained from the last five events for the same repository.

## Selenium Testing


## Task Tracking
We used Asana to track our tasks and detailed description of our tasks can be found in this [worksheet](WORKSHEET.md).



### Screencast
