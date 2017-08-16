const should = require('should');
const mongoose = require('mongoose');
const Weather = require("../models/weatherSchema");

describe("MongoDB", function() {
  afterEach(function() {
    if (this.connection != 'undefined') {
      Weather.collection.drop();
    }
  });

  it("should be able to connect to db", function(done) {
    // TODO: Refactor dependency
    mongoose.Promise = global.Promise;
    this.connection = mongoose.connect('mongodb://localhost:27017/worktest', function(err, db) {
      should.not.exist(err);
      done();
    });
  });

  it("should save and load weather", function (done) {
    const weather = new Weather({
      minTem : "21",
      maxTem : "35",
      windSpeed : "4",
      humidity : "37",
      weather : "sunny"
    });
    weather.save(function (err, out) {
      should.not.exist(err);
      should.equal(out, weather);
      done();
    });
  });
});
