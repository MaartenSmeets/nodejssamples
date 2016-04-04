var should = require('should');
var cache = require('../cache');
var assert = require('assert');
var request = require('request');
var url = require('url');
var http = require('http');
var baseurl = "http://localhost:3000/cache";
var express = require('express')
    , bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/cache', cache);
app.listen(3000);

describe('Cache', function() {
    var putrequest = { 'CACHE_KEY': 'greeting', 'CACHE_VALUE': 'Hello World' };
    describe('PUT', function() {
        it('should respond to a put request', function(done) {
            request({
                url: baseurl + '/',
                method: 'PUT',
                json: putrequest
            }, function(err, res) {
                if (err) {
                    throw err;
                };
                assert(res.statusCode == 201);
                done();
            }
            );
        });
        it('should respond to a second put request', function(done) {
            request({
                url: baseurl + '/',
                method: 'PUT',
                json: putrequest
            }, function(err, res) {
                if (err) {
                    throw err;
                };
                assert(res.statusCode == 200);
                done();
            }
            );
        });
    });

    describe('GET', function() {
        it('should respond to a get request', function(done) {
            request({
                url: baseurl + '/greeting',
                method: 'GET',
                json: {}
            }, function(err, res) {
                if (err) {
                    throw err;
                };
                assert(res.statusCode == 200);
                assert(res.body.result == 'Hello World');
                done();
            }
            );
        });
        it('should respond to a second get request. entry not found', function(done) {
            request({
                url: baseurl + '/greeting2',
                method: 'GET',
                json: {}
            }, function(err, res) {
                if (err) {
                    throw err;
                };
                assert(res.statusCode == 404);
                done();
            }
            );
        });
    });

    describe('DELETE', function() {
        it('should respond to a delete request. Not found', function(done) {
            request({
                url: baseurl + '/greeting2',
                method: 'DELETE',
                json: {}
            }, function(err, res) {
                if (err) {
                    throw err;
                };
                assert(res.statusCode == 404);
                assert(res.body.result == "Item not found");
                done();
            }
            );
        });
        it('should respond to a second delete request. entry found', function(done) {
            request({
                url: baseurl + '/greeting',
                method: 'DELETE',
                json: {}
            }, function(err, res) {
                if (err) {
                    throw err;
                };
                assert(res.statusCode == 200);
                assert(res.body.result == "Item deleted");
                done();
            }
            );
        });
        it('should respond to a third GET request. entry not found', function(done) {
            request({
                url: baseurl + '/greeting',
                method: 'GET',
                json: {}
            }, function(err, res) {
                if (err) {
                    throw err;
                };
                assert(res.statusCode == 404);
                assert(res.body.result == "");
                done();
            }
            );
        });
    });
})

