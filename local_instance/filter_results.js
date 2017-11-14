const request = require('request');
var fs=require('fs');
var data = fs.readFileSync('./conf.json'),repositoryInfo;
const Vulnerability = require('./server/models').Vulnerability;
var zap_small = [
	{ "sourceid": "3",
		"other": "This issue still applies to error type pages (401, 403, 500, etc) as those pages are often still affected by injection issues, in which case there is still concern for browsers sniffing pages away from their actual content type.At 'High' threshold this scanner will not alert on client or server error responses.",
		"method": "GET",
		"evidence": "",
		"pluginId": "10021",
		"cweid": "16",
		"confidence": "Medium",
		"wascid": "15",
		"description": "The Anti-MIME-Sniffing header X-Content-Type-Options was not set to 'nosniff'. This allows older versions of Internet Explorer and Chrome to perform MIME-sniffing on the response body, potentially causing the response body to be interpreted and displayed as a content type other than the declared content type. Current (early 2014) and legacy versions of Firefox will use the declared content type (if one is set), rather than performing MIME-sniffing.",
		"messageId": "1",
		"url": "http://localhost:8083/PatientsApp/",
		"reference": "http://msdn.microsoft.com/en-us/library/ie/gg622941%28v=vs.85%29.aspx https://www.owasp.org/index.php/List_of_useful_HTTP_headers",
		"solution": "Ensure that the application/web server sets the Content-Type header appropriately, and that it sets the X-Content-Type-Options header to 'nosniff' for all web pages. If possible, ensure that the end user uses a standards-compliant and modern web browser that does not perform MIME-sniffing at all, or that can be directed by the web application/web server to not perform MIME-sniffing.",
		"alert": "X-Content-Type-Options Header Missing",
		"param": "X-Content-Type-Options",
		"attack": "",
		"name": "X-Content-Type-Options Header Missing",
		"risk": "Low",
		"id": "1" },
	{ "sourceid": "3",
		"other": "",
		"method": "GET",
		"evidence": "",
		"pluginId": "10020",
		"cweid": "16",
		"confidence": "Medium",
		"wascid": "15",
		"description": "X-Frame-Options header is not included in the HTTP response to protect against 'ClickJacking' attacks.",
		"messageId": "1",
		"url": "http://localhost:8083/PatientsApp/",
		"reference": "http://blogs.msdn.com/b/ieinternals/archive/2010/03/30/combating-clickjacking-with-x-frame-options.aspx",
		"solution": "Most modern Web browsers support the X-Frame-Options HTTP header. Ensure it's set on all web pages returned by your site (if you expect the page to be framed only by pages on your server (e.g. it's part of a FRAMESET) then you'll want to use SAMEORIGIN, otherwise if you never expect the page to be framed, you should use DENY. ALLOW-FROM allows specific websites to frame the web page in supported web browsers).",
		"alert": "X-Frame-Options Header Not Set",
		"param": "X-Frame-Options",
		"attack": "",
		"name": "X-Frame-Options Header Not Set",
		"risk": "Medium",
		"id": "2" }
	];

	var zap_big = [
	 { "sourceid": "3",
			"other": "The X-XSS-Protection HTTP response header allows the web server to enable or disable the web browser's XSS protection mechanism. The following values would attempt to enable it: \nX-XSS-Protection: 1; mode=block\nX-XSS-Protection: 1; report=http://www.example.com/xss\nThe following values would disable it:\nX-XSS-Protection: 0\nThe X-XSS-Protection HTTP response header is currently supported on Internet Explorer, Chrome and Safari (WebKit).Note that this alert is only raised if the response body could potentially contain an XSS payload (with a text-based content type, with a non-zero length).",
			"method": "GET",
			"evidence": "",
			"pluginId": "10016",
			"cweid": "933",
			"confidence": "Medium",
			"wascid": "14",
			"description": "Web Browser XSS Protection is not enabled, or is disabled by the configuration of the 'X-XSS-Protection' HTTP response header on the web server",
			"messageId": "1",
			"url": "http://localhost:8083/PatientsApp/",
			"reference": "https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet https://blog.veracode.com/2014/03/guidelines-for-setting-security-headers/",
			"solution": "Ensure that the web browser's XSS filter is enabled, by setting the X-XSS-Protection HTTP response header to '1'.",
			"alert": "Web Browser XSS Protection Not Enabled",
			"param": "X-XSS-Protection",
			"attack": "",
			"name": "Web Browser XSS Protection Not Enabled",
			"risk": "Low",
			"id": "0" },
		{ "sourceid": "3",
			"other": "This issue still applies to error type pages (401, 403, 500, etc) as those pages are often still affected by injection issues, in which case there is still concern for browsers sniffing pages away from their actual content type.At 'High' threshold this scanner will not alert on client or server error responses.",
			"method": "GET",
			"evidence": "",
			"pluginId": "10021",
			"cweid": "16",
			"confidence": "Medium",
			"wascid": "15",
			"description": "The Anti-MIME-Sniffing header X-Content-Type-Options was not set to 'nosniff'. This allows older versions of Internet Explorer and Chrome to perform MIME-sniffing on the response body, potentially causing the response body to be interpreted and displayed as a content type other than the declared content type. Current (early 2014) and legacy versions of Firefox will use the declared content type (if one is set), rather than performing MIME-sniffing.",
			"messageId": "1",
			"url": "http://localhost:8083/PatientsApp/",
			"reference": "http://msdn.microsoft.com/en-us/library/ie/gg622941%28v=vs.85%29.aspx https://www.owasp.org/index.php/List_of_useful_HTTP_headers",
			"solution": "Ensure that the application/web server sets the Content-Type header appropriately, and that it sets the X-Content-Type-Options header to 'nosniff' for all web pages. If possible, ensure that the end user uses a standards-compliant and modern web browser that does not perform MIME-sniffing at all, or that can be directed by the web application/web server to not perform MIME-sniffing.",
			"alert": "X-Content-Type-Options Header Missing",
			"param": "X-Content-Type-Options",
			"attack": "",
			"name": "X-Content-Type-Options Header Missing",
			"risk": "Low",
			"id": "1" },
		{ "sourceid": "3",
			"other": "",
			"method": "GET",
			"evidence": "",
			"pluginId": "10020",
			"cweid": "16",
			"confidence": "Medium",
			"wascid": "15",
			"description": "X-Frame-Options header is not included in the HTTP response to protect against 'ClickJacking' attacks.",
			"messageId": "1",
			"url": "http://localhost:8083/PatientsApp/",
			"reference": "http://blogs.msdn.com/b/ieinternals/archive/2010/03/30/combating-clickjacking-with-x-frame-options.aspx",
			"solution": "Most modern Web browsers support the X-Frame-Options HTTP header. Ensure it's set on all web pages returned by your site (if you expect the page to be framed only by pages on your server (e.g. it's part of a FRAMESET) then you'll want to use SAMEORIGIN, otherwise if you never expect the page to be framed, you should use DENY. ALLOW-FROM allows specific websites to frame the web page in supported web browsers).",
			"alert": "X-Frame-Options Header Not Set",
			"param": "X-Frame-Options",
			"attack": "",
			"name": "X-Frame-Options Header Not Set",
			"risk": "Medium",
			"id": "2" }
		];

		var snyk_small = [{
      "title": "Remote Memory Exposure",
      "credit": [
        "Feross Aboukhadijeh"
      ],
      "language": "js",
      "packageManager": "npm",
      "moduleName": "request",
      "packageName": "request",
      "id": "npm:request:20160119",
      "description": "test 12387612",
      "semver": {
        "vulnerable": "<2.68.0 >2.2.5",
        "unaffected": ">=2.68.0 <=2.2.5"
      },
      "CVSSv3": "CVSS:3.0/AV:L/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N",
      "severity": "medium",
      "identifiers": {
        "CWE": [
          "CWE-201"
        ],
        "CVE": [],
        "NSP": 309,
        "ALTERNATIVE": [
          "SNYK-JS-REQUEST-10088"
        ]
      },
      "patches": [
        {
          "urls": [
            "https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/request/20160119/request_20160119_0_0_3d31d4526fa4d4e4f59b89cabe194fb671063cdb.patch"
          ],
          "version": "<2.68.0 >=2.54.0",
          "modificationTime": "2016-03-22T12:00:05.158Z",
          "comments": [],
          "id": "patch:npm:request:20160119:0"
        },
        {
          "urls": [
            "https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/request/20160119/request_20160119_0_1_3d31d4526fa4d4e4f59b89cabe194fb671063cdb.patch"
          ],
          "version": "<2.54.0 >2.51.0",
          "modificationTime": "2016-03-22T12:00:05.158Z",
          "comments": [],
          "id": "patch:npm:request:20160119:1"
        },
        {
          "urls": [
            "https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/request/20160119/request_20160119_0_2_3d31d4526fa4d4e4f59b89cabe194fb671063cdb.patch"
          ],
          "version": "<=2.51.0 >2.47.0",
          "modificationTime": "2016-03-22T12:00:05.158Z",
          "comments": [],
          "id": "patch:npm:request:20160119:2"
        },
        {
          "urls": [
            "https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/request/20160119/request_20160119_0_3_3d31d4526fa4d4e4f59b89cabe194fb671063cdb.patch"
          ],
          "version": "=2.47.0",
          "modificationTime": "2016-03-27T12:00:05.158Z",
          "comments": [],
          "id": "patch:npm:request:20160119:3"
        },
        {
          "urls": [
            "https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/request/20160119/request_20160119_0_4_3d31d4526fa4d4e4f59b89cabe194fb671063cdb.patch"
          ],
          "version": "<2.47.0 >=2.27.0",
          "modificationTime": "2016-03-27T12:00:05.158Z",
          "comments": [],
          "id": "patch:npm:request:20160119:4"
        },
        {
          "urls": [
            "https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/request/20160119/request_20160119_0_5_3d31d4526fa4d4e4f59b89cabe194fb671063cdb.patch"
          ],
          "version": "<2.27.0 >=2.16.0",
          "modificationTime": "2016-03-27T12:00:05.158Z",
          "comments": [],
          "id": "patch:npm:request:20160119:5"
        },
        {
          "urls": [
            "https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/request/20160119/request_20160119_0_6_3d31d4526fa4d4e4f59b89cabe194fb671063cdb.patch"
          ],
          "version": "<2.16.0 >=2.9.150",
          "modificationTime": "2016-03-27T12:00:05.158Z",
          "comments": [],
          "id": "patch:npm:request:20160119:6"
        },
        {
          "urls": [
            "https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/request/20160119/request_20160119_0_7_3d31d4526fa4d4e4f59b89cabe194fb671063cdb.patch"
          ],
          "version": "<2.9.150 >=2.9.3",
          "modificationTime": "2016-03-27T12:00:05.158Z",
          "comments": [],
          "id": "patch:npm:request:20160119:7"
        },
        {
          "urls": [
            "https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/request/20160119/request_20160119_0_8_3d31d4526fa4d4e4f59b89cabe194fb671063cdb.patch"
          ],
          "version": "<2.9.3 >=2.2.6",
          "modificationTime": "2016-03-27T12:00:05.158Z",
          "comments": [],
          "id": "patch:npm:request:20160119:8"
        }
      ],
      "cvssScore": 5.1,
      "creationTime": "2016-03-22T12:00:05.158Z",
      "modificationTime": "2017-01-19T12:00:05.158Z",
      "publicationTime": "2016-03-22T12:00:05.158Z",
      "disclosureTime": "2016-01-19T04:57:05.158Z",
      "alternativeIds": [
        "SNYK-JS-REQUEST-10088"
      ],
      "from": [
        "code@1.0.0",
        "zaproxy@0.2.0",
        "request@2.36.0"
      ],
      "upgradePath": [
        false,
        false,
        "request@2.68.0"
      ],
      "version": "2.36.0",
      "name": "request",
      "isUpgradable": false,
      "isPatchable": true,
      "__filename": "/Users/jitinnagpal/Documents/SE/bot/code/SecurityBot/node_modules/zaproxy/node_modules/request/package.json",
      "parentDepType": "prod"
    },
    {
      "title": "Uninitialized Memory Exposure",
      "credit": [
        "ChALkeR"
      ],
      "language": "js",
      "packageManager": "npm",
      "moduleName": "tunnel-agent",
      "packageName": "tunnel-agent",
      "id": "npm:tunnel-agent:20170305",
      "description": "testkldnkdmka",
      "identifiers": {
        "CWE": [
          "CWE-201"
        ],
        "CVE": [],
        "ALTERNATIVE": [
          "SNYK-JS-TUNNELAGENT-10672"
        ]
      },
      "semver": {
        "unaffected": ">=0.6.0",
        "vulnerable": "<0.6.0"
      },
      "patches": [],
      "cvssScore": 5.1,
      "severity": "medium",
      "CVSSv3": "CVSS:3.0/AV:L/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N",
      "disclosureTime": "2017-03-04T22:00:00.000Z",
      "publicationTime": "2017-07-05T14:05:50.139Z",
      "modificationTime": "2017-07-05T07:23:57.738Z",
      "creationTime": "2017-07-05T07:23:57.738Z",
      "alternativeIds": [
        "SNYK-JS-TUNNELAGENT-10672"
      ],
      "from": [
        "code@1.0.0",
        "zaproxy@0.2.0",
        "request@2.36.0",
        "tunnel-agent@0.4.3"
      ],
      "upgradePath": [
        false,
        false,
        "request@2.81.0",
        "tunnel-agent@0.6.0"
      ],
      "version": "0.4.3",
      "name": "tunnel-agent",
      "isUpgradable": false,
      "isPatchable": false,
      "__filename": "/Users/jitinnagpal/Documents/SE/bot/code/SecurityBot/node_modules/zaproxy/node_modules/tunnel-agent/package.json",
      "parentDepType": "prod"
    }];
		var snyk_big=[{
      "title": "Prototype Override Protection Bypass",
      "credit": [
        "Snyk Security Research Team"
      ],
      "moduleName": "qs",
      "packageName": "qs",
      "language": "js",
      "packageManager": "npm",
      "id": "npm:qs:20170213",
      "description": "test 328964398",
      "identifiers": {
        "CWE": [
          "CWE-20"
        ],
        "CVE": [],
        "ALTERNATIVE": [
          "SNYK-JS-QS-10407"
        ]
      },
      "semver": {
        "vulnerable": "<6.3.2 >=6.3.0 || <6.2.3 >=6.2.0 || <6.1.2 >=6.1.0 || <6.0.4",
        "unaffected": ">=6.4.0 || ~6.3.2 || ~6.2.3 || ~6.1.2 || ~6.0.4"
      },
      "patches": [
        {
          "urls": [
            "https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/qs/20170213/630_632.patch"
          ],
          "version": "=6.3.0",
          "modificationTime": "2017-03-09T00:00:00.000Z",
          "comments": [],
          "id": "patch:npm:qs:20170213:0"
        },
        {
          "urls": [
            "https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/qs/20170213/631_632.patch"
          ],
          "version": "=6.3.1",
          "modificationTime": "2017-03-09T00:00:00.000Z",
          "comments": [],
          "id": "patch:npm:qs:20170213:1"
        },
        {
          "urls": [
            "https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/qs/20170213/621_623.patch"
          ],
          "version": "=6.2.1",
          "modificationTime": "2017-03-09T00:00:00.000Z",
          "comments": [],
          "id": "patch:npm:qs:20170213:2"
        },
        {
          "urls": [
            "https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/qs/20170213/622_623.patch"
          ],
          "version": "=6.2.2",
          "modificationTime": "2017-03-09T00:00:00.000Z",
          "comments": [],
          "id": "patch:npm:qs:20170213:3"
        },
        {
          "urls": [
            "https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/qs/20170213/610_612.patch"
          ],
          "version": "=6.1.0",
          "modificationTime": "2017-03-09T00:00:00.000Z",
          "comments": [],
          "id": "patch:npm:qs:20170213:4"
        },
        {
          "urls": [
            "https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/qs/20170213/611_612.patch"
          ],
          "version": "=6.1.1",
          "modificationTime": "2017-03-09T00:00:00.000Z",
          "comments": [],
          "id": "patch:npm:qs:20170213:5"
        },
        {
          "urls": [
            "https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/qs/20170213/602_604.patch"
          ],
          "version": "=6.0.2",
          "modificationTime": "2017-03-09T00:00:00.000Z",
          "comments": [],
          "id": "patch:npm:qs:20170213:6"
        },
        {
          "urls": [
            "https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/qs/20170213/603_604.patch"
          ],
          "version": "=6.0.3",
          "modificationTime": "2017-03-09T00:00:00.000Z",
          "comments": [],
          "id": "patch:npm:qs:20170213:7"
        }
      ],
      "cvssScore": 7.4,
      "severity": "high",
      "CVSSv3": "CVSS:3.0/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N",
      "disclosureTime": "2017-02-13T00:00:00.000Z",
      "publicationTime": "2017-03-01T10:00:54.163Z",
      "modificationTime": "2017-03-06T21:00:00.000Z",
      "creationTime": "2017-02-14T11:44:54.163Z",
      "alternativeIds": [
        "SNYK-JS-QS-10407"
      ],
      "from": [
        "code@1.0.0",
        "zaproxy@0.2.0",
        "request@2.36.0",
        "qs@0.6.6"
      ],
      "upgradePath": [
        false,
        false,
        "request@2.68.0",
        "qs@6.0.4"
      ],
      "version": "0.6.6",
      "name": "qs",
      "isUpgradable": false,
      "isPatchable": false,
      "__filename": "/Users/jitinnagpal/Documents/SE/bot/code/SecurityBot/node_modules/zaproxy/node_modules/qs/package.json",
      "parentDepType": "prod"
    },
    {
      "title": "Remote Memory Exposure",
      "credit": [
        "Feross Aboukhadijeh"
      ],
      "language": "js",
      "packageManager": "npm",
      "moduleName": "request",
      "packageName": "request",
      "id": "npm:request:20160119",
      "description": "test 12387612",
      "semver": {
        "vulnerable": "<2.68.0 >2.2.5",
        "unaffected": ">=2.68.0 <=2.2.5"
      },
      "CVSSv3": "CVSS:3.0/AV:L/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N",
      "severity": "medium",
      "identifiers": {
        "CWE": [
          "CWE-201"
        ],
        "CVE": [],
        "NSP": 309,
        "ALTERNATIVE": [
          "SNYK-JS-REQUEST-10088"
        ]
      },
      "patches": [
        {
          "urls": [
            "https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/request/20160119/request_20160119_0_0_3d31d4526fa4d4e4f59b89cabe194fb671063cdb.patch"
          ],
          "version": "<2.68.0 >=2.54.0",
          "modificationTime": "2016-03-22T12:00:05.158Z",
          "comments": [],
          "id": "patch:npm:request:20160119:0"
        },
        {
          "urls": [
            "https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/request/20160119/request_20160119_0_1_3d31d4526fa4d4e4f59b89cabe194fb671063cdb.patch"
          ],
          "version": "<2.54.0 >2.51.0",
          "modificationTime": "2016-03-22T12:00:05.158Z",
          "comments": [],
          "id": "patch:npm:request:20160119:1"
        },
        {
          "urls": [
            "https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/request/20160119/request_20160119_0_2_3d31d4526fa4d4e4f59b89cabe194fb671063cdb.patch"
          ],
          "version": "<=2.51.0 >2.47.0",
          "modificationTime": "2016-03-22T12:00:05.158Z",
          "comments": [],
          "id": "patch:npm:request:20160119:2"
        },
        {
          "urls": [
            "https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/request/20160119/request_20160119_0_3_3d31d4526fa4d4e4f59b89cabe194fb671063cdb.patch"
          ],
          "version": "=2.47.0",
          "modificationTime": "2016-03-27T12:00:05.158Z",
          "comments": [],
          "id": "patch:npm:request:20160119:3"
        },
        {
          "urls": [
            "https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/request/20160119/request_20160119_0_4_3d31d4526fa4d4e4f59b89cabe194fb671063cdb.patch"
          ],
          "version": "<2.47.0 >=2.27.0",
          "modificationTime": "2016-03-27T12:00:05.158Z",
          "comments": [],
          "id": "patch:npm:request:20160119:4"
        },
        {
          "urls": [
            "https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/request/20160119/request_20160119_0_5_3d31d4526fa4d4e4f59b89cabe194fb671063cdb.patch"
          ],
          "version": "<2.27.0 >=2.16.0",
          "modificationTime": "2016-03-27T12:00:05.158Z",
          "comments": [],
          "id": "patch:npm:request:20160119:5"
        },
        {
          "urls": [
            "https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/request/20160119/request_20160119_0_6_3d31d4526fa4d4e4f59b89cabe194fb671063cdb.patch"
          ],
          "version": "<2.16.0 >=2.9.150",
          "modificationTime": "2016-03-27T12:00:05.158Z",
          "comments": [],
          "id": "patch:npm:request:20160119:6"
        },
        {
          "urls": [
            "https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/request/20160119/request_20160119_0_7_3d31d4526fa4d4e4f59b89cabe194fb671063cdb.patch"
          ],
          "version": "<2.9.150 >=2.9.3",
          "modificationTime": "2016-03-27T12:00:05.158Z",
          "comments": [],
          "id": "patch:npm:request:20160119:7"
        },
        {
          "urls": [
            "https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/request/20160119/request_20160119_0_8_3d31d4526fa4d4e4f59b89cabe194fb671063cdb.patch"
          ],
          "version": "<2.9.3 >=2.2.6",
          "modificationTime": "2016-03-27T12:00:05.158Z",
          "comments": [],
          "id": "patch:npm:request:20160119:8"
        }
      ],
      "cvssScore": 5.1,
      "creationTime": "2016-03-22T12:00:05.158Z",
      "modificationTime": "2017-01-19T12:00:05.158Z",
      "publicationTime": "2016-03-22T12:00:05.158Z",
      "disclosureTime": "2016-01-19T04:57:05.158Z",
      "alternativeIds": [
        "SNYK-JS-REQUEST-10088"
      ],
      "from": [
        "code@1.0.0",
        "zaproxy@0.2.0",
        "request@2.36.0"
      ],
      "upgradePath": [
        false,
        false,
        "request@2.68.0"
      ],
      "version": "2.36.0",
      "name": "request",
      "isUpgradable": false,
      "isPatchable": true,
      "__filename": "/Users/jitinnagpal/Documents/SE/bot/code/SecurityBot/node_modules/zaproxy/node_modules/request/package.json",
      "parentDepType": "prod"
    },
    {
      "title": "Uninitialized Memory Exposure",
      "credit": [
        "ChALkeR"
      ],
      "language": "js",
      "packageManager": "npm",
      "moduleName": "tunnel-agent",
      "packageName": "tunnel-agent",
      "id": "npm:tunnel-agent:20170305",
      "description": "testkldnkdmka",
      "identifiers": {
        "CWE": [
          "CWE-201"
        ],
        "CVE": [],
        "ALTERNATIVE": [
          "SNYK-JS-TUNNELAGENT-10672"
        ]
      },
      "semver": {
        "unaffected": ">=0.6.0",
        "vulnerable": "<0.6.0"
      },
      "patches": [],
      "cvssScore": 5.1,
      "severity": "medium",
      "CVSSv3": "CVSS:3.0/AV:L/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N",
      "disclosureTime": "2017-03-04T22:00:00.000Z",
      "publicationTime": "2017-07-05T14:05:50.139Z",
      "modificationTime": "2017-07-05T07:23:57.738Z",
      "creationTime": "2017-07-05T07:23:57.738Z",
      "alternativeIds": [
        "SNYK-JS-TUNNELAGENT-10672"
      ],
      "from": [
        "code@1.0.0",
        "zaproxy@0.2.0",
        "request@2.36.0",
        "tunnel-agent@0.4.3"
      ],
      "upgradePath": [
        false,
        false,
        "request@2.81.0",
        "tunnel-agent@0.6.0"
      ],
      "version": "0.4.3",
      "name": "tunnel-agent",
      "isUpgradable": false,
      "isPatchable": false,
      "__filename": "/Users/jitinnagpal/Documents/SE/bot/code/SecurityBot/node_modules/zaproxy/node_modules/tunnel-agent/package.json",
      "parentDepType": "prod"
    }];
// filter_vulnerabilities('installation_repositorie','124','123',[ zap_big,snyk_big] );

function filter_vulnerabilities(type,cur_hash,pre_hash,vulnerabilities){
	console.log('inside filter_vulnerabilities');

	return new Promise(function(resolve, reject) {
		Vulnerability.create({
					curr_hash: cur_hash,
					prev_hash: pre_hash,
					zap_result: vulnerabilities[0],
					snyk_result: vulnerabilities[1]
				}).then(task => {
					// you can now access the newly created task via the variable task
					if (type === 'installation_repositories')
						resolve(vulnerabilities);
					else if (pre_hash == null || pre_hash==='0000000000000000000000000000000000000000'){
						resolve(vulnerabilities);
					} else {
						Vulnerability.findOne({where: {curr_hash: pre_hash,},}).then(vul => {
							console.log('-------------------------------vul found:'+vul);
						if(vul===null){
							resolve(vulnerabilities);
						}
						else{
							var vul2 = vul;
							var result = []
							var all_promises=[];
							var zap_promise = new Promise(function(resolve, reject) {
								var obj = [];
								old_vul = vul2.zap_result;
								var counter = 0;
								var index=0;
								for(element in vulnerabilities[0]){
									// console.log('element zap-------');
									// console.log(element);
									counter++;
									var vul = vulnerabilities[0][element];
									if(_isContains(old_vul,vul.name)){
										//vulnerability is not new
									}else{
										obj[index++]=vul;
									}
									if (counter == vulnerabilities[0].length){
										// console.log('result zap---------------');
										// console.log(obj);
										// result[0] = obj;
										// console.log(result);
										resolve(obj);
									}
								}
							});
							all_promises.push(zap_promise);


							//filter snyk vulnerabilities
							var snyk_promise = new Promise(function(resolve, reject) {
								var snyk_obj = [];
								old_vuls = vul2.snyk_result;
								var counter = 0;
								var index=0;
								for(element in vulnerabilities[1]){
									// console.log('element snyk-------');
									// console.log(element);
									counter++;
									var vul = vulnerabilities[1][element];
									if(_isContains(old_vuls,vul.title)){
										//vulnerability is not new
									}else{
										snyk_obj[index++]=vul;
									}
									if (counter == vulnerabilities[1].length){
										// console.log('result snyk---------------');
										// console.log(snyk_obj);
										// result[1]=snyk_obj;
										resolve(snyk_obj);
									}
								}
							});

							all_promises.push(snyk_promise);

							Promise.all(all_promises).then(function (values) {
								console.log(values[0]);
								console.log(values[1]);
								resolve(values);
							});

							// filter snyk vulnerabilities - end
						}
				});
			}
	});

	 });
 }

 function _isContains(json, value) {
     let contains = false;
     Object.keys(json).some(key => {
         contains = typeof json[key] === 'object' ? _isContains(json[key], value) : json[key] === value;
          return contains;
     });
     return contains;
}

function get_recent_vulnerabilities(){
 	return new Promise(function(resolve,reject){

 				console.log('inside get_recent_vulnerabilities');
	 			vuls = Vulnerability.findAll({
		 			limit:5,
		 			where:{},
		 			order:[['createdAt', 'DESC']]
	 			}).then(function(lists){
					var all_promises=[];
					var zap_promise = new Promise(function(resolve, reject) {
						var index=0;
						var counter1 = 0;
						var result = [];
			 			for(list in lists){
				 				var vulnerabilities = lists[list].zap_result;
								var counter2 = 0;
								counter1++;
				 				for(v in vulnerabilities){
										counter2++;
										//  console.log('--------------');
					 					var vul = vulnerabilities[v];
					 					if(_isContains(result,vul.name)){
						 					//vulverability isn't new
					 					}else{
											//new vulverability, added in result
					 							result[index++]=vul;
					 					}
										if (counter1 == list.length && counter2 == vulnerabilities.length) {
												resolve(result);
										}
				 				}
			 			}
					});
					all_promises.push(zap_promise);
					var snyk_promise = new Promise(function(resolve, reject) {
						var index=0;
						var counter1 = 0;
						var result = [];
			 			for(list in lists){
				 				var vulnerabilities = lists[list].snyk_result;
								var counter2 = 0;
								counter1++;
				 				for(v in vulnerabilities){
										counter2++;
										//  console.log('--------------');
					 					var vul = vulnerabilities[v];
					 					if(_isContains(result,vul.title)){
						 					//vulverability isn't new
					 					}else{
											//new vulverability, added in result
					 							result[index++]=vul;
					 					}
										if (counter1 == list.length && counter2 == vulnerabilities.length) {
												resolve(result);
										}
				 				}
			 			}
					});
					all_promises.push(snyk_promise);
					Promise.all(all_promises).then(function (values) {
						resolve(values);
					});
	 			});
 	});
}
get_recent_vulnerabilities().then(values=>{console.log(values)});


 module.exports={
 	filter_vulnerabilities,
	get_recent_vulnerabilities
 }
