const request = require('request');
var fs=require('fs');
// var data = fs.readFileSync('./conf.json'),repositoryInfo;
const Vulnerability = require('./server/models').Vulnerability;

// filter_vulnerabilities('installation_repositorie','124','123',[ zap_big,snyk_big] );

function filter_vulnerabilities(type,detail,cur_hash,pre_hash,vulnerabilities){
	console.log('inside filter_vulnerabilities');
	console.log('curr hash:'+cur_hash);
	console.log('pre hash:'+pre_hash);
	return new Promise(function(resolve, reject) {
		Vulnerability.create({
					curr_hash: cur_hash,
					prev_hash: pre_hash,
					zap_result: vulnerabilities[0],
					snyk_result: vulnerabilities[1]
				}).then(task => {
					// you can now access the newly created task via the variable task
					if (type === 'installation_repositories'){
						console.log('installation_repositories, resolving now');
						resolve(vulnerabilities);
					}

					else if (pre_hash == null || pre_hash==='0000000000000000000000000000000000000000'){
						console.log('pre hash is null, resolving now');
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
								console.log('zap promise');
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
										console.log('result zap---------------'+obj);
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
								console.log('snyk promise');
								var snyk_obj = [];
								old_vuls = vul2.snyk_result;
								var counter = 0;
								var index=0;
								if(vulnerabilities[1].length==0)
									resolve(snyk_obj);
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
										console.log('result snyk---------------'+snyk_obj);
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
					console.log('zap_promise_retrieved');
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
					console.log('snyk_promise_retrieved');
					all_promises.push(snyk_promise);
					Promise.all(all_promises).then(function (values) {
						console.log('both promises being sent');
						resolve(values);
					});
	 			});
 	});
}
// get_recent_vulnerabilities().then(values=>{console.log(values)});


 module.exports={
 	filter_vulnerabilities,
	get_recent_vulnerabilities
 }
