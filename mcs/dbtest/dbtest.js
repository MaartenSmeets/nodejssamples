module.exports = function (service) {

	service.get('/mobile/custom/dbtest/parameters', function (req, res) {
			req.oracleMobile.database.get(
				'Parameters', req.params.q).then(
				function (result) {
				res.send(result.statusCode, result.result);
			},
				function (error) {
				res.send(500, error.error);
			});
		});
		
	service.put('/mobile/custom/dbtest/parameters', function (req, res) {
		req.oracleMobile.database.merge(
			'Parameters',
			[{
					name : req.query.name,
					value : req.query.value
				}
			], {
			primaryKeys : 'name'
		}).then(
			function (result) {
			res.send(result.statusCode, result.result);
		},
			function (error) {
			res.send(500, error.error);
		});
	});
};

