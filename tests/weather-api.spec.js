const should = require('should');
const weatherApi = require('../models/weather-api.js');
const FORECAST_COUNT_PER_DAY = 8;

describe("Weather fetcher", function() {
  it('promise return value should exist', function() {
    return weatherApi.fetch().then(function(apiResponse){
      should.exist(apiResponse);
      // TODO: weather JSON에서 추출하는 로직을 따로 뺄 것.
      var weather = apiResponse["rss"]["channel"]["item"]["description"]["body"]["data"];      
      weather.length.should.be.aboveOrEqual(FORECAST_COUNT_PER_DAY);
    });
  });
});
