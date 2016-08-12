var https = require('https');
var http = require('http');
var httpProxy = require('http-proxy');

console.log(JSON.stringify(process.env));
var PORT = process.env.PORT || 80;

//
// Create a HTTP Proxy servers. agent determines HTTP or HTTPS
//

var oraclecloudproxyserver = httpProxy.createProxyServer({
		target : 'https://crashdummy7-accstrial.apaas.em2.oraclecloud.com',
		agent : https.globalAgent,
		headers : {
			host : 'crashdummy7-accstrial.apaas.em2.oraclecloud.com'
		}
	});

var googleproxyserver = httpProxy.createProxyServer({
		target : 'https://www.google.com',
		agent : https.globalAgent,
		headers : {
			host : 'google.com'
		}
	});

var amisproxyserver = httpProxy.createProxyServer({
		target : 'http://www.amis.nl',
		agent : http.globalAgent,
		headers : {
			host : 'amis.nl'
		}
	});

//
// Create a HTTP server and send requests to the proxy server
//

var httpserver = http.createServer(function (req, res) {
		console.log('Request on url: ' + req.url); // + ' with headers: ' + JSON.stringify(req.headers));
		//http://localhost:PORT/oraclecloud/* is proxied to https://crashdummy6-accstrial.apaas.em2.oraclecloud.com/*
		if (typeof req.url !== 'undefined') {
			if (req.url.startsWith("/oraclecloud")) {
				req.url = req.url.replace(/^\/oraclecloud/, "/");
				console.log('Proxying to oraclecloud');
				oraclecloudproxyserver.web(req, res);
			} else if (req.url.startsWith("/google")) {
				req.url = req.url.replace(/^\/google/, "/");
				console.log('Proxying to google');
				googleproxyserver.web(req, res);
			} else if (req.url.startsWith("/amis")) {
				req.url = req.url.replace(/^\/amis/, "/");
				console.log('Proxying to amis');
				amisproxyserver.web(req, res);
			} else {
				res.end('No match found');
			}
		}
	});

httpserver.listen(PORT);
console.log('Listening on port: ' + PORT);
