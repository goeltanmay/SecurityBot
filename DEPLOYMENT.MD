# DEPLOYMENT

### Acceptance tests

We have created a Github organization, SecurityBotOrganization for the purpose of testing our application. Please accept our invitations to join the organization and follow the steps given below to test our bot.

#### Use Case 1: Check security vulnerabilities of an application when bot is integrated with the repo for the first time

In this case, github signals the bot through installation_repositories event, which contains details of newly added repository, to check the code present in the repository against any potential vulnerabilities. Bot fetches the code from the repository and runs OWASP ZAP and Snyk. Bot will collect the list of vulnerabilities and raise an issue with the vulnerabilities found.

#### Use Case 2: A developer wants to see all the vulnerabilities introduced in the code because of his commit

One of the developers commits a piece of code. Github signals the bot with the push event which contains commit details. Bot fetches the code from the commit and runs OWASP ZAP and Snyk. Bot will collect the list of vulnerabilities and post a comment on the commit with the new vulnerabilities found because of it.

#### Use Case 3: A repo collaborator has to check a pull request for vulnerabilities

Some contributor raises a pull request. Github signals the bot with the pull_request event which contains details of the pull request. Bot fetches the code from the Pull Request and runs OWASP ZAP and Snyk. Bot makes comments on the Pull Request, detailing the new vulnerabilities added because of it.

#### Use Case 4: Get vulnerability report of the day via email

When a user needs an update about vulnerabilities present in a repository, he registers through a basic UI to receive an email. After registration, bot receives an email event and queries the database and fetches a list of vulnerabilities from past 5 commits. It sends out an email stating the vulnerabilities found.

### Task Tracking
We are using Asana to track our tasks and detailed description of our tasks for this milestone can be found under "Milestone: Deployment" in this [worksheet](WORKSHEET.md).

### Screencast
Screencast is available on [YouTube](https://youtu.be/5KhvW88rf5Q).
