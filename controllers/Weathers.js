const BaseController = require('./Base');
const View = require('../views/Base');

const ZONE_CODE_LENGTH = 10;

module.exports = BaseController.extend({
	name: "Weathers",
	run: function(req, res, next) {
		const zoneCode = req.params.zoneCode;
		if (!isValidZoneCode(zoneCode)) {
			next()
			return;
		}
		// TODO: Load weather with 'zoneCode' and return to client.
		// Currently just rendering request parameters.
		// Implement 'function loadWeather(zoneCode)' function
		// in 'weather-utils.js' and use it in here.
		res.send(req.params);
	}
})

function isValidZoneCode(zoneCode) {
	return typeof zoneCode !== 'undefined'
		&& zoneCode.length == ZONE_CODE_LENGTH;
}

