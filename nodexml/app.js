var express = require('express');

var helloworldservice = require('./helloworldservice');
var app = express();

app.use('/helloworldservice',helloworldservice);
app.listen(3000);

console.log('server running on port 3000');
