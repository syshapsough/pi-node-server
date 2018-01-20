// console.log('******************************************************************************');
// console.log('************************************ MQTT ************************************');
// console.log('******************************************************************************');

var mqttBroker = 'mqtt://ioc.eclipse.org:1883'
var couchDbHost = 'http://localhost:5984';
var mainDBHost = 'http://169.254.48.101:5984'

var mqtt = require('mqtt');
var nano = require('nano')(couchDbHost);
var http=require('http');

var questions = nano.use('oldarchive');
var audience=nano.use('studentaudience');
var subscriptionTopics;
var QuestionsPool=[];

var myargvs=process.argv.slice(3);
var slp=myargvs[0];

//mqtt client
// var client = mqtt.connect(mqttBroker);
// client.on('connect', function () {
// 	console.log("connected");
// 	pull_subscriptions(function(cb){
// 		subscriptionTopics.forEach(function(value){
// 			// console.log('gonna subscribe to '+value);
// 			client.subscribe(value);
// 		});		
// 	});
// 	pull_questions(function(cb){
// 		//console.log(QuestionsPool.length);
// 		var t=setInterval(post,slp*1000);
// 	});
// });
// client.on('message', function (topic, message) {
// 	//console.log('received '+message+' from '+topic)
// });

/*************************************************************************************************************/
pull_questions(function(cb){
	//console.log(QuestionsPool.length);
	var t=setInterval(post,slp*1000);
});
function post(){ 
	//console.log('gonna post')
	var row=null;
	var mathrandom=Math.random();
	var random=Math.floor(mathrandom*3293);
	console.log('getting Q at '+random);
	var oldbody;
	oldbody=QuestionsPool[random];
	//var body={};
	oldbody.qTs=new Date().getTime();
	oldbody.qAud='Global';
	//console.log(JSON.stringify(oldbody));
	var body=oldbody;
	var postoptions = {
	  host: '192.168.0.8',
	  path: '/question',
	  port: 8000,
	  method: 'POST',
	  headers: {
	    "Content-Type": "application/json",
		}
	};
	request = http.request(postoptions);
	request.end(JSON.stringify(body));
	request.on('error', function(e) {
		console.log('ERROR: ' + e.message);
	});
}

/*************************************************************************************************************/
function pull_subscriptions(callback) {
	audience.view('doc', 'get_all', function(err, body) {
		if (!err) {
			body.rows.forEach(function(item){
				//console.log(JSON.stringify(item.value));
				console.log(item);
				subscriptionTopics=item.value;	
			});
			callback('true');
		}
		else
			console.log(err);
	});
}
function pull_questions(cb) {
	questions.view('doc', 'get_all', function(err, body) {
		if (!err) {
			body.rows.forEach(function(item){
				QuestionsPool.push({qID:item.key, qQn:item.value})
			});
			cb(true);
		}
		else
			console.log(err);
	});
}
