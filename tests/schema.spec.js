const should = require('should');
const dailyWeathers = require("../models/weatherSchema");

describe("Schema", function (done) {
  it("should save and load weather", function () {
    const weather = new dailyWeathers({
      minTem : "21",
      maxTem : "35",
      windSpeed : "4",
      humidity : "37",
      weather : "sunny"
    });
    weather.save(function (err) {
      if (err) throw err
    });
    dailyWeathers.findOne({minTem:"21"}).exec(function (err, data) {
      if (err) throw err;
      should.equal(weather, data);
      done();
    });
  });
});
