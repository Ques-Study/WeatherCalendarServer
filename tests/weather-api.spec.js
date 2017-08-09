const should = require('should');
const weatherApi = require('../models/weather-api.js');
const FORECAST_COUNT_PER_DAY = 8;
const KEYS_OF_OBJECT_IN_WEATHER_ARRAY = ["hour", "day", "temp", "sky", "pty", "pop"];


describe("Weather fetcher", function() {
  var weatherArray = [];

  before(function() {
    return weatherApi.fetch().then(function(data) {
      weatherArray = data;
    })
  });

  it('promise return value should exist', function(done) {
    should.exist(weatherArray);
    weatherArray.length.should.be.aboveOrEqual(FORECAST_COUNT_PER_DAY);
    done();
  });

  it('Every element in Array has remanded keys and values', function(done) {
    weatherArray.forEach(function(weatherElement) {
      KEYS_OF_OBJECT_IN_WEATHER_ARRAY.forEach(function(key) {
        weatherElement.should.have.properties(key);  
      }, this);
    }, this);
    done();
  });
});
