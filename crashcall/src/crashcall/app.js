var express = require('express');
var http = require('http');
var app = express();
var os = require("os");
var PORT = process.env.PORT || 80;

app.use('/crashmebykillingprocess', function (req, res, next) {
  console.log('Killing server by exiting process');
  res.end('Killing server by exiting process on: ' + os.hostname());
  process.exit(1);
});

app.use('/crashmenot', function (req, res, next) {
  console.log('Process request');
  res.end('Done: ' + os.hostname());
});

app.use('/crashmebyoutofmemory', function (req, res, next) {
  console.log('Killing server by out of memory');
  res.end('Killing server by out of memory on: ' + os.hostname());
  var cur = 167772160;
  var bcast = 184549375;
  var addresses = [];
  while (cur <= bcast) {
    cur += 1;
    addresses.push(cur);
  }
  console.log(addresses.length);
  console.log(addresses);
});

app.server = http.createServer(app);
app.server.listen(PORT);
console.log('Listening on: ' + PORT + ' on server ' + os.hostname());