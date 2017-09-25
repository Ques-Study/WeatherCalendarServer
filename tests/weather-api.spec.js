const should = require('should');
const mongoose = require('mongoose');
const weatherApi = require('../models/weather-api.js');
const Weather = require('../models/weatherSchema.js');
const FORECAST_COUNT_PER_DAY = 8;
const FILTER_KEYS = weatherApi.FILTER_KEYS;

describe("Weather fetcher", function() {
  it('Every weather should have keys and values', function() {
    var bokHyunCode = 2723067100;
    return weatherApi.fetch(bokHyunCode)
    .then(function(weatherObject) {
      should.exist(weatherObject);
      checkWeathersHaveProperties(weatherObject);
    });
  });
});

function checkWeathersHaveProperties(weatherObject){  
  weatherObject.forEach(function(dailyWeatherObject) {
    dailyWeatherObject["weathers"].forEach(function(weather){
      var weatherKey = Object.keys(weather._doc);
      var schemaKey = Object.keys(Weather.schema.obj.weathers[0]);
        weatherKey.should.containDeep(schemaKey);
    }, this);   
  }, this);
}
