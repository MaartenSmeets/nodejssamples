var fs = require('fs');

readFile('sample.txt', function (res) {
	console.log(res);
});

function readFile(filename, callback) {
	fs.readFile(filename, 'utf8', function (err, data) {
		if (!err) {
			processData(data, function (err, res) {
				if (!err) {
					callback(res);
				}
			})
		}
	});
}

function processData(data, callback) {
	callback(null, data.toUpperCase());
}

