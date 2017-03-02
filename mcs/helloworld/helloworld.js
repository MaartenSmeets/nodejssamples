/**
 * The ExpressJS namespace.
 * @external ExpressApplicationObject
 * @see {@link http://expressjs.com/3x/api.html#app}
 */ 

/**
 * Mobile Cloud custom code service entry point.
 * @param {external:ExpressApplicationObject}
 * service 
 */
module.exports = function(service) {

	/**
	 *  The file samples.txt in the archive that this file was packaged with contains some example code.
	 */

	service.get('/mobile/custom/helloworld', function(req,res) {

		sdk = req.oracleMobile;
		var message = {
			"Header" : null,
			"Body" : {
				"process" : {
					"input" : req.query.q
				}
			}
		};
		sdk.connectors.HelloWorldSOAPConn.post('process', message,{inType: "json"}).then(
			function (result) {
			console.log(JSON.stringify(result));
			res.send(result.statusCode, result.result);
		},
			function (error) {
				console.log(JSON.stringify(error));
				res.send(500, error.error);
			}
		)
	});
};
