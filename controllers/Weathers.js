const BaseController = require('./Base');
const View = require('../views/Base');
const weatherUtils = require('../models/weather-utils.js');

const ZONE_CODE_LENGTH = 10;

module.exports = BaseController.extend({
	name: "Weathers",
	run: function(req, res, next) {
		const zoneCode = req.params.zoneCode;
		if (!isValidZoneCode(zoneCode)) {
			next()
			return;
		}
		const now = new Date();
		const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		weatherUtils.loadWeatherQuery(date, zoneCode).exec(function(err, weather) {
			// TODO: Remove log below when test is over
			console.log(weather);
			const refinedWeather = weatherUtils.reformWeather(weather);
			res.send(refinedWeather);
			next();
		});
	}
})

function isValidZoneCode(zoneCode) {
	return typeof zoneCode !== 'undefined'
		&& zoneCode.length == ZONE_CODE_LENGTH;
}

