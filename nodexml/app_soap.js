var http = require('http');
var soap = require('soap');

var helloworldservice = {
    Hello_Service: {
        Hello_Port: {
            // This is how to define an asynchronous function.
            sayHello: function (args, callback) {
                // do some work
                console.log('sayHello: '+JSON.stringify(args));
                callback({'greeting': 'Hello '+args.firstName.$value});
            }
        }
    }
};

var wsdlxml = require('fs').readFileSync('helloworld.wsdl', 'utf8'),
    server = http.createServer(function (request, response) {
        response.end("404: Not Found: " + request.url);
    });

var PORT = 3000;

server.listen(PORT);
console.log('server running on port ' + PORT);

soap.listen(server, '/helloworldservice', helloworldservice, wsdlxml);
