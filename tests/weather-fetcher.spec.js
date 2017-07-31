const should = require('should');
const weatherFetcher = require('../models/weather-fetcher.js');

describe("Weather fetcher", function() {
  it('promise return value should exist', function() {
    return weatherFetcher.fetch().then(function(jsonData){
      should.exist(jsonData);
      var localWeather = jsonData["rss"]["channel"]["item"]["description"]["body"]["data"];      
      localWeather.should.have.length(15);
    });
  });
});
 