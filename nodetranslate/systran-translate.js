var request = require('request');
var url = "https://api-platform.systran.net/translation/text/translate";
var api_key = "8ca1f5e0-47eb-42a3-a9b4-3497ab6bbd0a";

function translate(translateinput, callback) {
	var data = {
		key : api_key,
		source : translateinput.source,
		target : translateinput.target,
		input : translateinput.text
	};
	//console.log(JSON.stringify(data));
	//console.log('Sending Systran request');
	var req = request.get({
			url : url,
			qs : data,
			headers : {
				'Referer' : 'MyNodeApp'
			}
		},
			function (err, response, body) {
			//console.log('Systran request send: ' + JSON.stringify(req));
			//console.log('Systran response received response: ' + JSON.stringify(response));
			//console.log('Systran response received body: ' + JSON.stringify(body));

			if (typeof body === 'string')
				try {
					body = JSON.parse(body);
				} catch (exp) {}

			callback(body.outputs[0].output);
		})
};
exports.translate = translate;
