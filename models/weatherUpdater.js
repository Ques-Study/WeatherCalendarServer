const Weather = require("./weatherSchema");
const weatherApi = require("./weather-api");

module.exports.updateWeatherData = function(weather) {
  return new Promise(function(resolve, reject) {
    var savedCount = 0;
    for (var i = 0; i < weather.length; i++) {
      updateWeather(weather[i], function(err) {
        if (err) {
          reject(err);
          return;
        }
        if (weather.length == ++savedCount) {
          resolve();
        }
      });
    }
  });
}

function updateWeather(dailyWeather, callback) {
  Weather.findOne({ date: dailyWeather.date }, function(err, oldWeather){
    if (err) {
      console.log("db err");
    }
    if(!oldWeather){
      saveNewDailyWeathers(dailyWeather);
			callback(err);
    } else {
      updateHourlyWeather(oldWeather, dailyWeather);
			callback(err);
    }
  });
}

function saveNewDailyWeathers(newDailyWeather) {
	newDailyWeather.save(function(err) {
		if(err) {
		  console.log("Save err");
		} else {
      console.log("Weather saved");
		}
	});
}

function updateHourlyWeather(oldWeather, newWeather) {
	const date = newWeather.date
	const updatedWeathers = setUpdatedWeatherArray(oldWeather, newWeather);
	Weather.update({ date: date }, { $set: { weathers: updatedWeathers }}, function(err) {
		if(err) {
			console.log("Update err");
		} else {
			console.log("Weather updated");
		}
	});
}

function setUpdatedWeatherArray(oldWeatherObject, newWeatherObject) {
	const oldWeathersArrayLength = oldWeatherObject.weathers.length - newWeatherObject.weathers.length;
	const updatedWeathers = [];
	for(var i = 0; i<oldWeathersArrayLength; i++) {
		updatedWeathers.push(oldWeather.weathers[i]);
	}
	newWeatherObject.weathers.forEach(function(newWeather) {
		updatedWeathers.push(newWeather);
	});
	return updatedWeathers;
}
