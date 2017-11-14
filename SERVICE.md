### Service

We have integrated two services, OWASP ZAP and Snyk for finding vulnerabilities in a project.

#### OWASP ZAP


#### Snyk


#### Use cases

1. __Check security vulnerabilities of an application when bot is integrated with the repo for the first time:__ In this case, github signals the bot through installation_repositories event, which contains details of newly added repository, to check the code present in the repository against any potential vulnerabilities. Bot fetches the code from the repository and runs OWASP ZAP and Snyk. Bot will collect the list of vulnerabilities and raise an issue with the vulnerabilities found.

2. __A developer wants to see all the vulnerabilities introduced in the code because of his commit:__ One of the developers commits a piece of code. Github signals the bot with the push event which contains commit details. Bot fetches the code from the commit and runs OWASP ZAP and Snyk. Bot will collect the list of vulnerabilities and post a comment on the commit with the new vulnerabilities found because of it.

3. __A repo collaborator has to check a pull request for vulnerabilities:__ Some contributor raises a pull request. Github signals the bot with the pull_request event which contains details of the pull request. Bot fetches the code from the Pull Request and runs OWASP ZAP and Snyk. Bot makes comments on the Pull Request, detailing the new vulnerabilities added because of it.

4. __Get vulnerability report of the day via email:__ When a user needs an update about vulnerabilities present in a repository, he registers through a basic UI to receive an email. After registration, bot receives an email event and queries the database and fetches a list of vulnerabilities from past 5 commits. It sends out an email stating the vulnerabilities found.
