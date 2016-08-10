var http = require('http');
var querystring = require('querystring');

var logger = function (msg) {
    console.log.apply(this, arguments);
};

//used for finding the correct element in an array of elements in the result of xml2js
var search = function (searchfor, array) {
    //console.log('Search called with array: '+array.length+' looking for: '+searchfor);
    for (key in array) {
        //console.log('Key: ' + key + ' Value: ' + JSON.stringify(array[key]));
        //console.dir(array[key]);
        if (array[key][searchfor] != undefined) {
            //console.log('Returning: '+JSON.stringify(array[key][searchfor]));
            return array[key][searchfor];
        }
    }
    return null;
}

exports.search = search;
exports.logger = logger;