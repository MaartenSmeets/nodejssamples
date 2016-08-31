var request = require('request');
var async = require('async');
var randomstring = require('randomstring');
var cluster = require('cluster');
var process = require('process');
var pid = process.pid;
var numCPUs = require('os').cpus().length;

function logger(msg) {
	console.log.apply(this, arguments);
};

if (cluster.isMaster) {
	for (var i = 0; i < numCPUs; i++) {
		logger(pid+"\tMaster: creating fork: "+i);
		cluster.fork();
	};
	
	cluster.on('exit',(worker,code,signal) => {
		logger(pid+"\tWorker dies");
	});
	
	cluster.on('online',(worker,code,signal) => {
		logger(pid+"\tWorker started");
	});
} else {
	var largemsg = '';
	//size in bytes
	logger(pid+"\tGenerating message");
	for (i = 0; i < 1000000; i++) {
		largemsg = largemsg + randomstring.generate({
				length : 1,
				charset : 'alphabetic'
			});
	};
	var sendmsg = {
		'msg' : largemsg
	};

	logger(pid+"\tGenerating request function");
	var requestfunc = function doRequest(callback) {
		var startTimeHR = process.hrtime();

		request.post({
			url : 'http://localhost:8401/test',
			form : {
				'msg' : sendmsg
			}
		}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var durationHR = process.hrtime(startTimeHR);
				logger(pid+"\tRequest end. Duration in ms:\t%d", (durationHR[0]*1000)+(durationHR[1] / 1000000));
				callback();
			} else {
				logger(pid+"\tError! " + JSON.stringify(error));
				callback();
			}
		});
	};

	var requests = [];

	logger(pid+"\tCreating array of functions");
	for (i = 0; i < 1000000; i++) {
		requests.push(requestfunc);
	};

	logger(pid+"\tExecuting functions in serie");
	async.series(requests);
}
