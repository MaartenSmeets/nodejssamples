var express = require('express')
    , bodyParser = require('body-parser')
    , http = require('http')
    , url = require('url');

var router = express.Router();
var cache = {};

function logger(msg) {
    //console.log.apply(this,arguments);
}

router.use(function timeLogStart(req, res, next) {
    logger('Request start');
    res.locals.startTimeHR = process.hrtime();
    next();
});

router.put('/', function(req, res, next) { //process 
    logger("PUT: "+req.body.CACHE_KEY+": "+req.body.CACHE_VALUE);
    var result_msg = {};
    if (req.body.CACHE_KEY in cache) {
        var result_msg = { "result": "Cache entry updated: " + req.body.CACHE_KEY + " = " + req.body.CACHE_VALUE };
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        next();
    } else {
        var result_msg = { "result": "Cache entry added: " + req.body.CACHE_KEY + " = " + req.body.CACHE_VALUE };
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 201;
        next();
    }
    cache[req.body.CACHE_KEY] = req.body.CACHE_VALUE;
    res.end(JSON.stringify(result_msg));
    next();
});

router.get('/:CACHE_KEY', function(req, res, next) {
    logger("GET: "+req.params['CACHE_KEY']);
    if (req.params['CACHE_KEY'] in cache) {
        var result_msg = { "result": cache[req.params['CACHE_KEY']] };
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
    } else {
        var result_msg = { "result": "" };
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 404;
    }
    res.end(JSON.stringify(result_msg));
    next();
});

router.delete('/:CACHE_KEY', function(req, res, next) {
    logger("DELETE: "+req.params['CACHE_KEY']);
    if (req.params['CACHE_KEY'] in cache) {
        delete cache[req.params['CACHE_KEY']];
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        result_msg = { "result": "Item deleted" };
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 404;
        result_msg = { "result": "Item not found" };
    }
    res.setHeader
    res.end(JSON.stringify(result_msg));
    next();
});

router.use(function timeLogEnd(req, res, next) {
    var durationHR = process.hrtime(res.locals.startTimeHR);
    logger("Request end. Duration: %ds %dms",durationHR[0],durationHR[1]/1000000);
    next();
});

module.exports = router;