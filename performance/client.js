var request = require('request');
var async = require('async');

function guid() {
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	s4() + '-' + s4() + s4() + s4();
}

function s4() {
	return Math.floor((1 + Math.random()) * 0x10000)
	.toString(16)
	.substring(1);
}

function logger(msg) {
	console.log.apply(this, arguments);
}
var largemsg = '';
//size in bytes
for (i = 0; i < 1000000-4; i++) {
	largemsg = largemsg + 'A';
};

var requestfunc = function doRequest(callback) {
	var myguid = guid();
	//logger('Request start: '+myguid);
	var startTimeHR = process.hrtime();

	request.post({
		url : 'http://localhost:8401/test',
		form: {'msg':largemsg}
	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//logger(body); // Show the HTML for the Google homepage.
			var durationHR = process.hrtime(startTimeHR);
			logger("Request end. Duration: %ds %dms", durationHR[0], durationHR[1] / 1000000);
			callback();
		} else {
			logger('Error! ' + JSON.stringify(error));
			callback();
		}
	});
};

var requests = [];

for (i = 0; i < 1000000; i++) {
	requests.push(requestfunc);
};

async.series(requests);
