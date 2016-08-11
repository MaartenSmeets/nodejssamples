var express = require('express');
var http = require('http');
var parseString = require('xml2js').parseString;
var stripPrefix = require('xml2js').processors.stripPrefix;
var Builder = require('xml2js').Builder;
var fs = require("fs");
var util = require("util");
var url = require('url');
var async = require('async');
var bodyParser = require('body-parser');
var myutils = require('./myutils');
var router = express.Router();
var helloworldservice = {};

var servicewsdl = 'helloworld.wsdl';

router.use(bodyParser.text({ type: '*/*' }));
router.use(function timeLogStart(req, res, next) {
    myutils.logger('Request start');
    res.locals.startTimeHR = process.hrtime();
    next();
});

//for the wsdl: http://localhost:3000/helloworldservice?wsdl
router.get('/', function (req, res, next) {
    myutils.logger("GET");
    if (req.query.wsdl === "") {
        res.setHeader('Content-Type', 'application/xml');
        res.statusCode = 200;
        fs.readFile(servicewsdl, "utf8", function (err, data) {
            if (err) {
                endResponse(err);
            } else {
                endResponse(data);
            }
        });
    } else {
        endResponse("Invalid GET request");
    }

    function endResponse(data) {
        res.write(data);
        res.end();
        next();
    }
});

router.post('/', function (req, res, next) { //process 
    myutils.logger("POST");
    async.waterfall([
        function (cb) {
            myutils.logger('Convert POST request to usable JSON');
            //myutils.logger('Input: '+JSON.stringify(req.body));
            //removing the prefix to make processing more easy
            parseString(req.body, { tagNameProcessors: [stripPrefix] }, cb);
        },
        function (result, cb) {
            myutils.logger('Processing JSONized XML message');
            //myutils.logger('Input: ' + JSON.stringify(result));
            var body = result["Envelope"]["Body"];
            //finding the correct elements
            var sayHello = myutils.search("sayHello", body);
            var firstName = myutils.search("firstName", sayHello);
            var firstNameValue = myutils.search("_", firstName);
            cb(null, 'Hello ' + firstNameValue);
        }
    ],
        function (err, results) {
            if (err) {
                results = "I don't know your name";
            }
            //building the response
            var builder = new Builder();
            //var xmlresponse = '<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:examples:helloservice"><soapenv:Header/><soapenv:Body><urn:sayHelloResponse soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><greeting xsi:type="xsd:string">?</greeting></urn:sayHelloResponse></soapenv:Body></soapenv:Envelope>'

            var jsonresponse = {
                "soapenv:Envelope": {
                    "$": {
                        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                        "xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
                        "xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/",
                        "xmlns:urn": "urn:examples:helloservice"
                    },
                    "soapenv:Header": [""],
                    "soapenv:Body": [{
                        "urn:sayHelloResponse": [{
                            "$": {
                                "soapenv:encodingStyle": "http://schemas.xmlsoap.org/soap/encoding/"
                            },
                            "greeting": [{
                                "_": results,
                                "$": {
                                    "xsi:type": "xsd:string"
                                }
                            }
                            ]
                        }
                        ]
                    }
                    ]
                }
            }

            var xmlresponse = builder.buildObject(jsonresponse);

            myutils.logger('Returning response Result: ' + JSON.stringify(results) + ' Error: ' + JSON.stringify(err));

            res.setHeader('Content-Type', 'application/xml');
            res.statusCode = 200;
            res.end(xmlresponse);
            next(err, results);
        }
    );
});

router.use(function timeLogEnd(req, res, next) {
    var durationHR = process.hrtime(res.locals.startTimeHR);
    myutils.logger("Request end. Duration: %ds %dms", durationHR[0], durationHR[1] / 1000000);
    next();
});

module.exports = router;