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
module.exports = function (service) {


	/**
	 *  The file samples.txt in the archive that this file was packaged with contains some example code.
	 */
	
	service.get('/mobile/custom/weatherapi1', function (req, res) {
		console.log('received request');
		var sdk=req.oracleMobile;
		var queryObject = {};
		queryObject.q = req.query.q;
		queryObject.APPID='xxx'
		
		sdk.connectors.get("openweathermap", null,{ qs: queryObject }).then(
			function (result) {
				try {
					res.statusCode = result.statusCode;
					res.setHeader('Content-Type', 'application/json');
					var parsedObject = eval("(" + result.result + ")");
					var temp = parsedObject.main.temp - 273.15; //converting Kelvin to Celcius
					var sendback = JSON.stringify({ "result":temp });
					res.end(sendback);
				} catch (err) {
					console.warn('Exception: '+JSON.stringify(err));
					res.end(err.message);
				}
			},
			function (error) {
				console.log('received error while calling openweathermap: '+JSON.stringify(error));
				res.send(500, error.error);
			})
	});
};
