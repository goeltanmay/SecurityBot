# DEPLOYMENT

### Deployment scripts

We have created ansible playbook for deploying our bot server and a local instance. The instructions to execute these commands are written in readme.md file which can be found [here](https://github.com/goeltanmay/SecurityBot/blob/master/README.md)

Please follow the instructions under Deployment Milestone to run the playbooks.

### Acceptance tests

We have created a Github organization, SecurityBotOrganization for the purpose of testing our application. Please accept our invitations to join the organization and follow the steps given below to test our bot.

#### Use Case 1: Check security vulnerabilities of an application when bot is integrated with the repo for the first time

In this case, github signals the bot through installation_repositories event, which contains details of newly added repository, to check the code present in the repository against any potential vulnerabilities. Bot fetches the code from the repository and runs OWASP ZAP and Snyk. Bot will collect the list of vulnerabilities and raise an issue with the vulnerabilities found.

Please follow the following steps to test this use case:

1. Go to this [link](https://github.com/organizations/SecurityBotOrganization/settings/installations) to add PatientsApp to the Robocop Bot application
2. You will see an Installed Github application named "Robocop App". Click on Configure button
3. Scroll down the page and you will see Repository Access. If you see PatientsApp in the list of Selected Repositories, then remove it.
4. Now type PatientsApp and select it to add to the Robocop
5. Go to PatientsApp repository which is already added to the SecurityBotOrganization. Select branch as master and click on Issues. You can see a new issue which contains a list of three vulnarabilities  that are detected by ZAP and Snyk.

#### Use Case 2: A developer wants to see all the vulnerabilities introduced in the code because of his commit

One of the developers commits a piece of code. Github signals the bot with the push event which contains commit details. Bot fetches the code from the commit and runs OWASP ZAP and Snyk. Bot will collect the list of vulnerabilities and post a comment on the commit with the new vulnerabilities found because of it.

Please follow the following steps to test this use case:

1. Go to PatientsApp and create a new branch and give it a name, say "testing".
2. Select the pom.xml file to add a new dependency in it. Copy the code given below in "dependencies" tag in pom.xml file:

        <dependency>
             <groupId>org.eclipse.jetty</groupId>
             <artifactId>jetty-servlet</artifactId>
             <version>7.6.0.v20120127</version>
         </dependency>

3. The Jetty dependency should introduce a new vulnerability named "Cryptographic Issues". Go ahead and commit this file.

4. Now open the commits of PatientsApp and open the commit that you just made. You will see that a new vulnerability will be shown as a comment with the name "Cryptographic Issues" that was picked by Snyk because of Jetty dependency.

#### Use Case 3: A repo collaborator has to check a pull request for vulnerabilities

Some contributor raises a pull request. Github signals the bot with the pull_request event which contains details of the pull request. Bot fetches the code from the Pull Request and runs OWASP ZAP and Snyk. Bot makes comments on the Pull Request, detailing the new vulnerabilities added because of it.

Please follow the following steps to test this use case:

1. Go to the PatientsApp again and create a new pull request to merge the "testing branch" with master. Keep base as "master" and compare as "testing".

2. At the end of the pull request you will see a comment with  new vulnerability named "Cryptographic Issues" which means that the new branch introduces a new vulnerability to the system before merging this branch to the master.

#### Use Case 4: Get vulnerability report of the day via email

When a user needs an update about vulnerabilities present in a repository, he registers through a basic UI to receive an email. After registration, bot receives an email event and queries the database and fetches a list of vulnerabilities from past 5 commits. It sends out an email stating the vulnerabilities found.

Please follow the following steps to test this use case:

1. Go to this [link](http://desolate-fortress-49649.herokuapp.com/emailreport) and fill in your the "Github user id" as:"SecurityBotOrganization", "Github Repository" as: "PatientsApp" and "Email" as:"<your email id>".

2. Click Submit

3. Open your mail and you will see an email from Robocop containing a report of vulnerabilities that were introduced due to the last five commits.


### Task Tracking
We are using Asana to track our tasks and detailed description of our tasks for this milestone can be found under "Milestone: Deployment" in this [worksheet](WORKSHEET.md).

### Screencast
Screencast is available on [YouTube](https://youtu.be/Qhn-OpmSwQM).
