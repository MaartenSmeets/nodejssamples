var express = require('express')
    , bodyParser = require('body-parser')
    ;

var cache = {};
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.put('/cache', function(req, res) { //process 
    var result_msg = {};
    if (req.body.CACHE_KEY in cache) {
        var result_msg = { "result": "Cache entry updated: " + req.body.CACHE_KEY + " = " + req.body.CACHE_VALUE };
        res.statusCode=200;
    } else {
        var result_msg = { "result": "Cache entry added: " + req.body.CACHE_KEY + " = " + req.body.CACHE_VALUE };
        res.statusCode=201;
    }
    cache[req.body.CACHE_KEY] = req.body.CACHE_VALUE;
    res.end(JSON.stringify(result_msg));
})
    .get('/cache/:CACHE_KEY', function(req, res) {
        if (req.params['CACHE_KEY'] in cache) {
            var result_msg = { "result": cache[req.params['CACHE_KEY']] };
            res.statusCode=200;
        } else {
            var result_msg = { "result": "" };
            res.statusCode=404;    
        }
        res.end(JSON.stringify(result_msg));
    })
    .delete('/cache/:CACHE_KEY', function(req, res) {
        if (req.params['CACHE_KEY'] in cache) {
            delete cache[req.params['CACHE_KEY']];
            res.statusCode=200;
            result_msg = {"result":"Item deleted"};
        } else {
            res.statusCode=404;
            result_msg = {"result":"Item not found"};
        }
        res.end(JSON.stringify(result_msg));
    })
    .listen(3000);

console.log('server running on port 3000');
