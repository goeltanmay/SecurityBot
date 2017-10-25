var express = require('express');
var app = express();
const util = require('util');
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies



// zaproxy.core.sites(function (err, resp) {
//   console.log(resp.sites);
//   resp.sites.forEach(function (site) {
//     // do something with the site
//     console.log(site);
//   });
// });




var options = { proxy: 'http://localhost:8081' };
var ZapClient = require('zaproxy');
var zaproxy = new ZapClient(options);
zaproxy.ascan.scan('http://localhost:8081',null, function(err, res, body) {
if(err){
logger.info('Error found from scan ' + err);
// callback(err, 1);
}
logger.info('\n do something to ascan scan the site \n');
// logger.info('Ascan progress %: '+ zap.ascan.status() + ' \n');
});
// app.post('/test',function(req,res){
//   console.log("inside test");
//   if (req.method == 'POST') {
//         var body = '';
//         console.log(req.body.name);
//         console.log(req.body.id);
//         // console.log(request.body);
//         res.send(util.inspect(req.query,false,null));
//     }
//
// })
