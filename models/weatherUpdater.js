const Weather = require("./weatherSchema");
const weatherApi = require("./weather-api");

module.exports.updateWeatherData = function(weather) {
  weather.forEach(function(day) {
    saveWeather(day);
  });
}

function saveWeather(newWeatherObject) {
  const date = dailyWeatherObject.date;
  Weather.findOne({ date: date }, function(err, oldWeatherObject){
    if (err) {
      console.log("There is an error while reading weather list from database.");
    }
    if(oldWeatherObject){
      const oldWeathersLength = oldWeatherObject.weathers.length - newWeatherObject.weather.length;
      const updatedWeathers = [];
      for(var i = 0; i<oldWeathersLength; i++){
        updatedWeathers.push(oldWeatherObject.weathers[i]);
      }
      newWeatherObject.weathers.forEach(function(newWeather) {
        updatedWeathers.push(newWeather);
      });
      Weather.update({ date: date }, { $set: { weathers: updatedWeathers }}, function(err) {
        if(err){
          console.log("There is an error while updating weather informations.");
        } else {
        console.log("Weather informations updated.");
        }
      });
    } else {
      newWeatherObject.save(function(err){
        if(err){
          console.log("There is an error while saveing new weather informations.");
        } else {
        console.log("New weather informations saved.");
        }
      });
    }
  });
};
