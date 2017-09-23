# DESIGN
#### Problem Statement:
Data is prime commodity for any corporate. While developing an application it is responsibility of the developers to allow restricted access to data and follow proper security protocols. For example, an offshoot of Anonymous, hacktivist group Lulzsec in June 2011 hacked into Sony Pictures via SQL Injection attack and stole data that included names, passwords, e-mail and home addresses of thousands of customers. The group claimed to have compromised over one million accounts.

> >“As the world is increasingly interconnected, everyone shares the responsibility of securing cyberspace.”

> Newton Lee, Counterterrorism and Cybersecurity: Total Information Awareness

As the world gets online, hackers have more and more incentives to breach the security of applications on the web and obtain valuable information. Recent hacking of Equifax only goes to show that not even the biggest companies are completely secure. However, it is not the companies that are the worst hit by these hacks. The users of their products, whose details are leaked, are the ones hardest hit. As more and more personal services go online, it is imperative to secure them properly. Leak of Personal Identifiable Information is the biggest threat to consumers of these applications as it can have consequences that may not be immediately visible.

The main cause of services not being secure enough is the fact that most developers are not thinking about security when they are building these applications. This means that applications are often vulnerable to some of the oldest and easiest attacks. Things like sql-injection, cross-site scripting and CSRF attacks have been known about for quite some time now and many effective mitigation strategies have been developed to counter these attacks. However, we are seeing more and more of these attacks. Hence there is an urgent need to automatically detect if there are vulnerabilities in the code, and to correct them as soon as possible.

There are several static analysis tools and fuzzing tools to test the security of an application, however, they require the developer to be constantly running them in his workstation and keep checking for their result. We feel that an automated bot can ease this process, so that the developers can concentrate on writing code. The bot we imagine will create ‘issues’ on github repos, comment on specific lines of code which introduce a vulnerability and assign these to the developer who wrote the code.

#### Bot Description:
We aim at developing a drone bot that responds to different git operations when applied to a git repository. For example, when a collaborator commits to a git repo, then it will scan the code using OWASP ZAP API’s and static source analyzers to find the components of User Interface or a module that can be compromised for a security attack.

ZAP API works by actually running the web application in a browser. It attempts penetration testing on different web pages and identifies the network attacks to which a page is prone to. WAP is another tool to detect and correct input validation vulnerabilities in web applications written in PHP and predicts false positives. The tool combines source code static analysis and data mining to detect vulnerabilities and predict false positives. It then corrects the source code to remove the vulnerabilities inserting fixes(small functions) in the right places of the source code.

Our bot application will be using these tools to scan the changes in the code for vulnerabilities and possible network attacks to raise issues if any such vulnerability is found and can raise comments on appropriate locations, for example, on commits applied to a repository. The application can be integrated to any github repository and it can also be invoked with git pull request and commit operation.
