const Weather = require("./weatherSchema");
const weatherApi = require("./weather-api");

module.exports.updateWeather = function(weathers) {
  return new Promise(function(resolve, reject) {
    var savedCount = 0;
    for (var i = 0; i < weathers.length; i++) {
      updateWeather(weathers[i], function(err) {
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
}

function updateWeather(dailyWeather, callback) {
  Weather.findOne({ date: dailyWeather.date }, function(err, oldWeather){
    if (err) {
      console.log("db err");
			callback(err);
			return;
    }
    if(!oldWeather){
      saveNewDailyWeathers(dailyWeather, callback);
    } else {
      updateHourlyWeather(oldWeather, dailyWeather, callback);
    }
  });
}

function saveNewDailyWeathers(newDailyWeather, callback) {
	newDailyWeather.save(function(err) {
		if(err) {
		  console.log("Save err");
  		callback(err);
		} else {
      console.log("Weather saved");
			callback();
		}
	});
}

function updateHourlyWeather(oldWeather, newWeather, callback) {
	const date = newWeather.date
	const updatedWeathers = getUpdatedHourlyWeathers(oldWeather, newWeather);
	Weather.update({ date: date }, { $set: { weathers: updatedWeathers }}, function(err) {
		if(err) {
			console.log("Update err");
  		callback(err);
		} else {
			console.log("Weather updated");
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

