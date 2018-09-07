var express = require('express')
var fs = require('fs')
var morgan = require('morgan')
var path = require('path')
var app = express()

var expresssoap = require('express-soap');
var soap = expresssoap.soap;

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
    flags: 'a'
})

var xml = require('fs').readFileSync('helloworldservice.wsdl', 'utf8');

// setup the logger
app.use(morgan('tiny', {
    stream: accessLogStream
}))

//Hosting the service
app.use('/soap/helloworld', soap({
    services: { /* Services */
        Hello_Service: { /* Ports */
            Hello_Port: { /* Methods */
                sayHello: function(args, callback, headers, req) {
                    setTimeout(function() {
                        callback({
                            greeting: 'Hello ' + args.firstName.$value
                        })
                    }, 1000);
                }
            }
        }
    },
    xml: xml
}));

app.listen(3000, () => console.log('Example app listening on port 3000!'))
