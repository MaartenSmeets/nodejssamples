var readFile = require('fs-readfile-promise');

readMyFile('sample.txt', function (err, res) {
	if (!err) {
		console.log(res);
	}
});

function readMyFile(filename, callback) {
	return readFile(filename, 'utf8')
	.then(function (data) {
		return processData(data,callback)
	});
}

function processData(data, callback) {
	callback(null, data.toUpperCase());
}
