const should = require('should');
const mongoose = require('mongoose');
const dailyWeathers = require("../models/weatherSchema");

describe("MongoDB", function() {
  afterEach(function() {
    if (this.connection != 'undefined') {
      dailyWeathers.collection.drop();
    }
  });

  after(function() {
    if (this.connection != 'undefined') {
      this.connection.connection.db.dropDatabase(function() {
        console.log("dropped.");
      });
      this.connection.connection.close();
    }
  });

  it("should be able to connect to db", function(done) {
    // TODO: Refactor dependency
    this.connection = mongoose.connect('mongodb://localhost:27017/worktest', function(err, db) {
      if (err) {
        should.exist(null);
        done();
      } else {
        should.exist(true);
        done();
      }
    });
  });

  it("should save and load weather", function (done) {
    const weather = new dailyWeathers({
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
