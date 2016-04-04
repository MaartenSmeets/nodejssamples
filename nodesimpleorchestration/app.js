var express = require('express')
    , bodyParser = require('body-parser');

var cache = require('./cache');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/cache',cache);
app.listen(3000);

console.log('server running on port 3000');
