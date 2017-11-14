### Service

We have integrated two services, OWASP ZAP and Snyk for finding vulnerabilities in a project.

#### OWASP ZAP
We used Zed Attack Proxy(ZAP) to perform penetration testing of repository that is registered with our bot application. ZAP operates by running the deployed instance of an application in a browser using proxy to hit the URL's that are part of the application to identify the vulnerabilities that can be potential causes for a network attack.

Whenever a local instance, which contains the deployed instance, receives a request from server hosted bot application, which listens to GitHub events, it updates the code for that particular repository. It then calls ZAP API service which returns a list of vulnerabilities which is sent back to the server bot which performs further action such as raising an issue, commenting to a commit or a pull request on the GitHub repository depending on the type of request/event.

#### Snyk
Snyk helps us find vulnerabilities in Node.js npm, Ruby and Java dependencies. 

#### Use cases

1. __Check security vulnerabilities of an application when bot is integrated with the repo for the first time:__ In this case, github signals the bot through installation_repositories event, which contains details of newly added repository, to check the code present in the repository against any potential vulnerabilities. Bot fetches the code from the repository and runs OWASP ZAP and Snyk. Bot will collect the list of vulnerabilities and raise an issue with the vulnerabilities found.

2. __A developer wants to see all the vulnerabilities introduced in the code because of his commit:__ One of the developers commits a piece of code. Github signals the bot with the push event which contains commit details. Bot fetches the code from the commit and runs OWASP ZAP and Snyk. Bot will collect the list of vulnerabilities and post a comment on the commit with the new vulnerabilities found because of it.

3. __A repo collaborator has to check a pull request for vulnerabilities:__ Some contributor raises a pull request. Github signals the bot with the pull_request event which contains details of the pull request. Bot fetches the code from the Pull Request and runs OWASP ZAP and Snyk. Bot makes comments on the Pull Request, detailing the new vulnerabilities added because of it.

4. __Get vulnerability report of the day via email:__ When a user needs an update about vulnerabilities present in a repository, he registers through a basic UI to receive an email. After registration, bot receives an email event and queries the database and fetches a list of vulnerabilities from past 5 commits. It sends out an email stating the vulnerabilities found.

#### Task Tracking
We are using Asana to track our tasks and detailed description of our tasks for this milestone can be found under "Milestone: Service" in this [worksheet](WORKSHEET.md).

#### Screencast
Screencast is available in [YouTube](https://youtu.be/QWTKwQYfV18).
