// Load the http module to create an http server
//localhost:8000?text=dog&source=en&target=es
var http = require('http');
var url = require('url');
var googleTranslate = require('./google-translate.js');

var PORT = process.env.PORT || 8000;

// Configure our HTTP server
var server = http.createServer(function (request, response) {
    response.writeHead(200, { "Content-Type": "application/json" });
    var queryObject = url.parse(request.url, true).query;
    var text = queryObject.text;
	var source = queryObject.source;
	var target = queryObject.target;
    googleTranslate.translate({
		text: text,
		source: source,
		target: target
		}, function(result) {
			console.log("Answer received: "+result)
			sendResponse(result);
		});
	function sendResponse(result){
		var returnvalue = {'result':result};
		response.end(JSON.stringify(returnvalue));
	}
  }
);

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(PORT);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:"+PORT);