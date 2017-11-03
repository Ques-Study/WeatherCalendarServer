const Weather = require("./weatherSchema");

module.exports.saveWeathers = function(weathers) {
	return new Promise(function(resolve, reject) {
		var savedCount = 0;
		for (var i = 0; i < weathers.length; i++) {
			saveOrUpdateWeather(weathers[i], function(err) {
				if (err) {
					reject(err);
					return;
				}
				if (weathers.length == ++savedCount) {
					resolve();
				}
			});
		}
	});
};

module.exports.loadWeather = function(date, zoneCode) {
	return new Promise(function(resolve, reject) {
		Weather.findOne({ date: date, zoneCode: zoneCode }).exec(function(err, weather) {
			if(err) {
				reject(err);
				return;
			}
			resolve(weather);
		});
	});
};

module.exports.convertWeatherToClientWeatherAPIResponse = function(weather) {
	var date = weather.date;
	var hourlyWeathers = weather.weathers;
	var reformedHourlyWeathers = [];
	hourlyWeathers.forEach(function(hourlyWeather) {
		var reformedHourlyWeather = {
			time: hourlyWeather.hour,
			temp: hourlyWeather.temp,
			pRainfall: hourlyWeather.rainfallProbability,
			sCode: hourlyWeather.skyCode,
			rCode: hourlyWeather.rainfallCode
		};
		reformedHourlyWeathers.push(reformedHourlyWeather);
	});
	var reformedWeather = {
		zCode: weather.zoneCode,
		weather: {
			day: date.getTime(),
			weathers: reformedHourlyWeathers
		}
	};
	return reformedWeather;
};

function saveOrUpdateWeather(dailyWeather, callback) {
	Weather.findOne({ date: dailyWeather.date, zoneCode: dailyWeather.zoneCode }, function(err, oldWeather){
		if (err) {
			callback(err);
			return;
		}
		if(!oldWeather){
			saveWeather(dailyWeather, callback);
		} else {
			updateWeather(oldWeather, dailyWeather, callback);
		}
	});
}

function saveWeather(weather, callback) {
	weather.save(function(err) {
		if(err) {
			callback(err);
		} else {
			callback();
		}
	});
}

function updateWeather(oldWeather, newWeather, callback) {
	const date = newWeather.date;
	const updatedWeathers = getUpdatedHourlyWeathers(oldWeather, newWeather);
	Weather.update({ date: date }, { $set: { weathers: updatedWeathers }}, function(err) {
		if(err) {
			callback(err);
		} else {
			callback();
		}
	});
}

function getUpdatedHourlyWeathers(oldWeather, newWeather) {
	if (newWeather.weathers.length == 0) {
		return oldWeather.weathers;
	}

	const firstHourOfNewWeather = newWeather.weathers[0].hour;
	var updatedHourlyWeathers = [];
	var oldHourlyWeathers = oldWeather.weathers.filter(function(weather) {
		return weather.hour < firstHourOfNewWeather;
	});
	oldHourlyWeathers.forEach(function(oldHourlyWeather) {
		updatedHourlyWeathers.push(oldHourlyWeather);
	});
	newWeather["weathers"].forEach(function(newHourlyWeather) {
		updatedHourlyWeathers.push(newHourlyWeather);
	});
	
	return updatedHourlyWeathers;
}

