const should = require('should');
const weatherFetcher = require('../models/weather-fetcher.js');

describe("Weather fetcher", function() {
  it('promise return value should exist', function() {
    return weatherFetcher.fetch().then(function(data){
        var items = data["rss"]["channel"]["item"]["description"]["body"]["data"];
        
        should.exist(data);
        items.should.have.length(15);
    });
  });
});
