// Load the http module to create an http server
//localhost:8000?text=dog&source=en&target=es
var http = require('http');
var url = require('url');
var googleTranslate = require('./google-translate.js');
var systranTranslate = require('./systran-translate.js');
var start = process.hrtime();
var PORT = process.env.PORT || 8000;

var elapsed_time = function (note) {
	var precision = 3; // 3 decimal places
	var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
	console.log(process.hrtime(start)[0] + "s, " + elapsed.toFixed(precision) + "ms - " + note); // print message + time
	//start = process.hrtime(); // reset the timer
}

// Configure our HTTP server
var server = http.createServer(function (request, response) {
		start = process.hrtime(); // reset the timer
		elapsed_time('Request start');
		response.writeHead(200, {
			"Content-Type" : "application/json"
		});
		var queryObject = url.parse(request.url, true).query;
		var done = false;
		var translateinput = {
			text : queryObject.text,
			source : queryObject.source,
			target : queryObject.target
		};
		googleTranslate.translate(translateinput, function (result) {
			//Slow down Google to illustrate SYSTRAN
			setTimeout(function () {
				result = result.toLowerCase();
				elapsed_time('Google response: '+result);
				sendResponse(result,'Google');
			}, 1000)
			//result = result.toLowerCase();
			//elapsed_time('Google response: ' + result);
			//sendResponse(result,'Google');
		});

		systranTranslate.translate(translateinput, function (result) {
			result = result.toLowerCase();
			elapsed_time('Systran response: ' + result);
			sendResponse(result,'Systran');
		});

		function sendResponse(result,source) {
			if (!done) {
				done = true;
				var returnvalue = {
					result : result,
					source : source
				};
				elapsed_time('Response returned to caller');
				response.end(JSON.stringify(returnvalue));
			}
		}
	});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(PORT);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:" + PORT);
