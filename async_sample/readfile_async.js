var fs = require('fs');
var async = require('async');

readFile('sample.txt',function(err,res) {
	if (!err) {
		console.log(res);
	} else {
		console.log(err);
	}
});

function readFile(filename, callback) {
    async.waterfall([
        function(callback) { 
			fs.readFile(filename, 'utf8',callback); 
		},
        function(data,callback) { 
			processData(data,callback); 
		}
    ], callback);
}

function processData(data,callback) {
	callback(null,data.toUpperCase());
}

