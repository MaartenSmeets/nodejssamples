var express = require('express');
var app = express();
var url = require('url');
var bodyParser = require('body-parser');

var PORT = 8401

var router = express.Router();

function logger(msg) {
    console.log.apply(this,arguments);
}

router.use(function timeLogStart(req, res, next) {
    //logger('Request start');
    res.locals.startTimeHR = process.hrtime();
    next();
});

router.post('/test', function(req, res, next) {
    //var queryObject = url.parse(req.url, true).query;
    //logger(JSON.stringify(req.body));
    //var result_msg = { "result": queryObject.id };
	//console.dir(req);
    var result_msg = { "result": 'dummy' };
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.json(result_msg);
    next();
});

router.use(function timeLogEnd(req, res, next) {
    var durationHR = process.hrtime(res.locals.startTimeHR);
    logger("Request end. Duration: %ds %dms" +' Size: '+req.headers['content-length'],durationHR[0],durationHR[1]/1000000);
    next();
});

app.use(bodyParser.urlencoded({
    extended: true,limit: '5mb'
}));

app.use('/',router);

app.listen(PORT, function () {
  console.log('Example app listening on port '+PORT);
});
