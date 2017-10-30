const BaseController = require('./Base');
const View = require('../views/Base');
const weatherUtils = require('../models/weather-utils.js');

const ZONE_CODE_LENGTH = 10;
const REQ_DATE_LENGTH = 8;

module.exports = BaseController.extend({
	name: "Weathers",
	run: function(req, res, next) {
		const zoneCode = req.params.zoneCode;
		const reqDate = req.params.date
		if (!isValidZoneCode(zoneCode) || !isValidReqDate(reqDate)) {
			res.send("Invalid zone code or date");
			return;
		}
		const date = convertDateToDbForm(reqDate);
		weatherUtils.loadWeather(date, zoneCode).exec(function(err, weather) {
			const refinedWeather = weatherUtils.convertWeatherToClientWeatherAPIResponse(weather);
			res.jsonp(refinedWeather);
		}).catch(function(err) {
			console.log("Db error");
		});
	}
})

function isValidZoneCode(zoneCode) {
	return typeof zoneCode !== 'undefined'
		&& zoneCode.length == ZONE_CODE_LENGTH;
}

function isValidReqDate(reqDate) {
	return typeof reqDate !== 'undefined'
		&& reqDate.length == REQ_DATE_LENGTH;
}

function convertDateToDbForm(rawDate) {
	const year = rawDate.slice(0,4);
	const month = rawDate.slice(4,6);
	const day = rawDate.slice(6,8);
	const date = new Date(year+"-"+month+"-"+day);
	return date;
}

