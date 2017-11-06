const request = require('request');
var fs=require('fs');
var data = fs.readFileSync('./conf.json'),repositoryInfo;
const Vulnerability = require('./server/models').Vulnerability;


function filter_vulnerabilities(type,cur_hash,pre_hash,vulnerabilities, callback){

	return new Promise(function(resolve,reject){

			var filtered_vulnerabilities;
	if(type=='integration'){
		Vulnerability.create({
			curr_hash: cur_hash,
			prev_hash: pre_hash,
			zap_result: vulnerabilities
		}).then(task => {
			// you can now access the newly created task via the variable task
		});
		filtered_vulnerabilities = vulnerabilities;
	}else{
		Vulnerability.create({
			curr_hash: cur_hash,
			prev_hash: pre_hash,
			zap_result: vulnerabilities
		}).then(task => {
			console.log("All vulnerabilities stored in database");
		});

		if(pre_hash==null){
			filtered_vulnerabilities = vulnerabilities;
		}else{
			console.log('not first commit');
			Vulnerability.findOne({where: {curr_hash: pre_hash,},}).then(vul => {
				old_vul = vul.zap_result;
				// console.log('----------------');
				// console.log(old_vul);

				var obj = [];
				var index=0;
				for(element in vulnerabilities){
					var vul = vulnerabilities[element];
					console.log(vul.name);
					if(_isContains(old_vul,vul.name)){
						//vulnerability is not new
					}else{
						obj[index]=vul;
					}
				}
				console.log(obj);
				filtered_vulnerabilities = obj;
			});
		}
	}
	resolve(filtered_vulnerabilities);

	});

	//var filtered_vulnerabilities;
	/*if(type=='integration'){
		Vulnerability.create({
			curr_hash: cur_hash,
			prev_hash: pre_hash,
			zap_result: vulnerabilities
		}).then(task => {
			// you can now access the newly created task via the variable task
		});
		filtered_vulnerabilities = vulnerabilities;
	}else{
		Vulnerability.create({
			curr_hash: cur_hash,
			prev_hash: pre_hash,
			zap_result: vulnerabilities
		}).then(task => {
			console.log("All vulnerabilities stored in database");
		});

		if(pre_hash==null){
			filtered_vulnerabilities = vulnerabilities;
		}else{
			console.log('not first commit');
			Vulnerability.findOne({where: {curr_hash: pre_hash,},}).then(vul => {
				old_vul = vul.zap_result;
				// console.log('----------------');
				// console.log(old_vul);

				var obj = [];
				var index=0;
				for(element in vulnerabilities){
					var vul = vulnerabilities[element];
					console.log(vul.name);
					if(_isContains(old_vul,vul.name)){
						//vulnerability is not new
					}else{
						obj[index]=vul;
					}
				}
				console.log(obj);
				filtered_vulnerabilities = obj;
			});
		}
	}
	callback(filtered_vulnerabilities);*/
}


function _isContains(json, value) {
    let contains = false;
    Object.keys(json).some(key => {
        contains = typeof json[key] === 'object' ? _isContains(json[key], value) : json[key] === value;
         return contains;
    });
    return contains;
 }


 //This method shall return recent vulnerabilities from last 5 commits
 function get_recent_vulnerabilities(){

 	return new Promise(function(resolve,reject){

 				console.log('inside get_recent_vulnerabilities');
	 			var result = [];
	 			vuls = Vulnerability.findAll({
		 			limit:5,
		 			where:{},
		 			order:[['createdAt', 'DESC']]
	 			}).then(function(lists){
		 			var index=0;
		 			for(list in lists){
			 				var vulnerabilities = lists[list].zap_result;
			 				for(v in vulnerabilities){
									//  console.log('--------------');
				 					var vul = vulnerabilities[v];
				 					if(_isContains(result,vul.name)){
					 					//vulverability isn't new
				 					}else{
										//new vulverability, added in result
				 							result[index++]=vul;
				 					}
			 				}
			 			console.log('result is---------------');
			 			console.log(result);
		 			}
	 			});

	 			resolve(result);

 	});

	 /*console.log('inside get_recent_vulnerabilities');
	 var result = [];
	 vuls = Vulnerability.findAll({
		 limit:5,
		 where:{},
		 order:[['createdAt', 'DESC']]
	 }).then(function(lists){
		 var index=0;
		 for(list in lists){
			 var vulnerabilities = lists[list].zap_result;
			 for(v in vulnerabilities){
				//  console.log('--------------');
				 var vul = vulnerabilities[v];
				 if(_isContains(result,vul.name)){
					 //vulverability isn't new
				 	}else{
						//new vulverability, added in result
				 		result[index++]=vul;
				 	}
			 }
			 console.log('result is---------------');
			 console.log(result);
		 }
	 });*/
 }

 module.exports={
 	filter_vulnerabilities,get_recent_vulnerabilities
 }