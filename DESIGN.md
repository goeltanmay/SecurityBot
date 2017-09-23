# DESIGN
#### Problem Statement:
Data is prime commodity for any corporate. While developing an application it is responsibility of the developers to allow restricted access to data and follow proper security protocols. For example, an offshoot of Anonymous, hacktivist group Lulzsec in June 2011 hacked into Sony Pictures via SQL Injection attack and stole data that included names, passwords, e-mail and home addresses of thousands of customers. The group claimed to have compromised over one million accounts.

> >“As the world is increasingly interconnected, everyone shares the responsibility of securing cyberspace.”  
> > Newton Lee, Counterterrorism and Cybersecurity: Total Information Awareness

As the world gets online, hackers have more and more incentives to breach the security of applications on the web and obtain valuable information. Recent hacking of Equifax only goes to show that not even the biggest companies are completely secure. However, it is not the companies that are the worst hit by these hacks. The users of their products, whose details are leaked, are the ones hardest hit. As more and more personal services go online, it is imperative to secure them properly. Leak of Personal Identifiable Information is the biggest threat to consumers of these applications as it can have consequences that may not be immediately visible.

The main cause of services not being secure enough is the fact that most developers are not thinking about security when they are building these applications. This means that applications are often vulnerable to some of the oldest and easiest attacks. Things like sql-injection, cross-site scripting and CSRF attacks have been known about for quite some time now and many effective mitigation strategies have been developed to counter these attacks. However, we are seeing more and more of these attacks. Hence there is an urgent need to automatically detect if there are vulnerabilities in the code, and to correct them as soon as possible.

There are several static analysis tools and fuzzing tools to test the security of an application, however, they require the developer to be constantly running them in his workstation and keep checking for their result. We feel that an automated bot can ease this process, so that the developers can concentrate on writing code. The bot we imagine will create ‘issues’ on github repos, comment on specific lines of code which introduce a vulnerability and assign these to the developer who wrote the code.

#### Bot Description:
We aim at developing a drone bot that responds to different git operations when applied to a git repository. For example, when a collaborator commits to a git repo, then it will scan the code using OWASP ZAP API’s and static source analyzers to find the components of User Interface or a module that can be compromised for a security attack.

ZAP API works by actually running the web application in a browser. It attempts penetration testing on different web pages and identifies the network attacks to which a page is prone to. WAP is another tool to detect and correct input validation vulnerabilities in web applications written in PHP and predicts false positives. The tool combines source code static analysis and data mining to detect vulnerabilities and predict false positives. It then corrects the source code to remove the vulnerabilities inserting fixes(small functions) in the right places of the source code.

Our bot application will be using these tools to scan the changes in the code for vulnerabilities and possible network attacks to raise issues if any such vulnerability is found and can raise comments on appropriate locations, for example, on commits applied to a repository. The application can be integrated to any github repository and it can also be invoked with git pull request and commit operation.

#### Use Cases:

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


#### Wireframes

Robocop will work as a service in github, and have the following screens :

##### Integration -
![Integration](wireframes/integrtion.JPG)  
The idea here is to show how a potential owner can add Robocop to his repo. He can go to settings and to services and integration tab, and search for Robocop. He just adds Robocop as a service, and Robocop starts doing its magic.

##### Issues Raised -
![Issues](wireframes/issue.jpg)  
After Robocop is added to a repo, it will raise issues for the vulnerabilities it finds in the application.

##### Commits pushed -
![Commit](wireframes/commit.JPG)  
When a user pushes a commit, robocop will make comments if there are any new security vulnerabilities created because of that commit.

##### Pull request created -
![Pull Request](wireframes/pull_request.JPG)  
Someone creates a pull request. This can be from the same repo of from a fork of this repo. Robocop will analyse the pull request and make comments about the security vulnerabilities introduced in this pull request.

##### Report Email -
![Report Email](wireframes/mail.JPG)

The bot can also send timely vulnerability report to the owner or the security team so that they may act on these quickly.

#### Storyboards

Some storyboards describing primary tasks of our bot:

##### Scenario 1 -
![Scenario 1](storyboards/commit.JPG)

A developer tries to use RoboCop to test his application against any security vulnerability as he builds it. He adds the service to his GitHub repository and starts development and make a commit. The commit triggers RoboCop to check the code/application and report any vulnerability found in the form of comments and issues.

##### Scenario 2 -
![Scenario 2](storyboards/pull_request.JPG)

Some developer wants to add a feature to an application utilizing RoboCop. He creates a pull request which triggers RoboCop to check for any security vulnerability present in the code. RoboCop comments on the pull request with list of vulnerabilities found.

#### Architecture Design
Before looking at the architecture, we wanted to figure out the different components of Robocop.

The first distinction is that the actual repository lives on github, while Robocop will run on some machine. So these two will be two separate components.  

Also, we plan to use 3 types of security analysis tools.  
1. Attack based tools like OWASP ZAP.
2. Static code analysis tools like OWASP WAP and Bandit.
3. Dependency checkers like Snyk and OWASP Dependency check.

Since these tools go through either the actual code or a deployed instance of the application, Robocop will need a git clone and a deployed instance of that application. This will be another part of the application.

Also, Robocop will need some database to store the vulnerabilities it finds, to make sure they are not reported again.

With that, we made the following overall architecture.

![Abstract Architecture](architecture/abstract_architecture.png)  

So Robocop acts as an interface between github repo, and the various security tools, and makes the decisions on which tools to call and what to do with the output. It checks the vulnerabilities it finds in the database, whether they have been reported before or not. If they are new vulnerabilities, they are reported to github in the appropriate format.

![Layered Architecture](architecture/LayeredArchitecture.png)

We can imagine a layered structure of Robocop. It listens to commit and pull request events and then checks for security vulnerabilities by calling appropriate APIs. The APIs could attack the application in various ways. They can analyze the code, check dependencies or directly attack the application webpages and find out vulnerabilities present. There are several tools available which can serve this purpose. Code analysis tools differ with programming languages or frameworks used.

![Robocop ZAP](architecture/Robocop_ZAP.png)

OWASP ZAP is an API to test for network vulnerabilities in the code. It tests the application to identify if any element is prone to network attacks. The Robocop continuously listens to the git operations and invokes the ZAP API to test the application for network vulnerabilities. ZAP performs penetration testing on the application to identify the vulnerabilities in the application. It also identifies the network attack that a component of the application is prone to. It gives back the discovered vulnerabilities and security issues to Robocop which stores them in a MySQL database. Robocop also raises an issue for each vulnerability found and also generates a report to the owner of the repository.

![Robocop Snyk](architecture/Robocop_Snyk.png)

Snyk.io is a software which checks an application for any dependency related vulnerability. Robocop receives dependency list from GitHub which it passes on to Snyk which will check the full list and provide all vulnerable dependencies present. Robocop will save the list in the database so that it can report the vulnerabilities whenever asked.

#### Architecture Patterns

Design of Robocop is a hybrid of 3 designs.

__Publish - Subscribe :__  
The main idea is to check for new security vulnerabilities introduced with each commit or pull request. So we use publish subscribe architecture where github notifies Robocop of all commit or pull request events. Robocop then checks the commits or pull request for vulnerabilities and reports the findings by either making comments or raising issues.

__Object-Oriented Pattern:__  
We have identified three different kinds of attack tools that inherit from the same attack interface. They take the same github event as input, and dispatch the attack command to the relavant attack tool. Polymorphic design helps providing a generic attack interface while delegating the attack request to relevant module. It also enables easy addition of more module and tools in future.

__Layered Pattern:__
Robocop uses three different types of layers.  

1. __Github Communication layer__ - This layer subscribes to github events and forwards the event to underlying layer. It also accepts the response from the underlying and decides how to give it to github.

2. __Attack Surface layer__ - This layer is the front end for all the attack request. Business logic identifies the attack type and delegates to approrpriate attack handler, like ZapHandler. It reports the vulnerabilities found to the layer above.

3. __Attack Tool Handler layer__ - This layer consists of wrappers for multiple attack tools which can be added or removed as required. It communicates with the actual tool using REST Apis or CLI interface, depending on the tool. It also stores or retrieves vulnerability information to/from the database.

4. __Tool layer__ - This layer consists of the actual tools used to conduct the attacks. Tools can be added or removed in accordance with the above layer.  
