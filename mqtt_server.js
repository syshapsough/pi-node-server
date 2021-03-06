var mqttBroker = 'mqtt://iot.eclipse.org:1883';
var couchDbHost = 'http://localhost:5984';
var questionsDB = 'questions';
var answersDB = 'answers';
var topic = 'questions';

var mqtt = require('mqtt');

var nano = require('nano')(couchDbHost);
var questions = nano.use(questionsDB);
var answers = nano.use(answersDB);

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());


/************************************************************ HTTP Server **********************************************************************/
//main page
app.get('/',  function (req, res) {
	console.log('got a simple get');
	res.send('hello');
});

//pull question from the database and send it back to the client
function getQuestion(req,res){
	pull_question(req.params.qID, function(arr){
		res.send(arr);
	});
};

//give me the question from this node using its ID
app.get('/question_byqID/:qID', getQuestion, function (req, res) {
});


//when a student submits a question to this pod, store it in the database then publish it to other pods
app.post('/question', function(req, res, next){
	console.log('got a question!');
	res.send('ok thanks');
	var qID = req.body.qID;
	var qAn = req.body.qAn;
	var qTs = req.body.qTs;
	var qRt = req.body.qRt;

	publish(JSON.stringify({qID:qID, Answer:qAn, Timestamp:qTs, Result:qRt}), topic);
	//insert_question({qID:qID, Answer:qAn, Timestamp:qTs, Result:qRt},0);
});

//start listening
app.listen(8000,function(){
	console.log('listening...');
});

/*************************************************************************************************************************************************/

/*********************************************************** MQTT Client *************************************************************************/
//mqtt client
//connect to the mqtt broker
var client = mqtt.connect(mqttBroker);
client.on('connect', function () {
	console.log("connected");
	//once connected, subscribe to 'questions' to receive entrys from other pods
	client.subscribe(topic);
});

//when a new question is received from other pods, store it in the database
client.on('message', function (topic, message) {
	insert_question(message,0);
});

//when a student submits a question, publish it to other pods
function publish(message, topic){
	var options={
		qos:0
	}
	client.publish(topic, message, options, function(){
    	console.log('sent');
  	});
}
/*************************************************************************************************************************************************/

/************************************************************* Database **************************************************************************/
/*INSERTS*/
function insert_answer(doc, tried) {
	answers.insert(doc, function (error,http_body,http_headers) {
			if(error) {
				if(error.message === 'no_db_file'  && tried < 1) {
					return nano.db.create('answers', function () {
						insert_answer(doc, tried+1);
					});
				}
				else { return console.log(error); }
			}
			console.log('inserted answer: ' + http_body);
		});
}

function insert_question(doc, tried) {
	questions.insert(doc, function (error,http_body,http_headers) {
			if(error) {
				if(error.message === 'no_db_file'  && tried < 1) {
					return nano.db.create('questions', function () {
						insert_question(doc, tried+1);
					});
				}
				else { return console.log(error); }
			}
			console.log('inserted question: ' + http_body);
		});
}

/*PULLS*/
/*pull question from questions database using the qID*/
function pull_question(ID, cb) {
	questions.view('doc', 'get_byID', { key: [ID] }, function(err, body) {
		var question;
		if (!err) {
			body.rows.forEach(function(item){
					question=item.value;
			});
			cb(question);
		}
		else
			console.log(err);
	});
}
/*************************************************************************************************************************************************/
