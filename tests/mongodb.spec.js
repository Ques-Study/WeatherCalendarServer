const should = require('should');
const mongoose = require('mongoose');
const Weather = require("../models/weatherSchema");

describe("MongoDB", function() {
	before(function(done) {
		mongoose.Promise = global.Promise;
		// TODO: Extract host value into environment
		this.connection = mongoose.connect('mongodb://localhost:27017/worktest', { useMongoClient: true }, function(err, db) {
			should.not.exist(err);
			done();
		});
	});

	after(function(done) {
		mongoose.disconnect(function() {
			done();
		});
	});

	afterEach(function() {
		if (this.connection != 'undefined') {
			Weather.collection.drop();
		}
	});

	it("should save and load weather", function (done) {
		const weather = new Weather({
			date: new Date(),
			weathers: [{
				hour: 6,
				temp: 27,
				skyCode: 0,
				rainfallCode: 1,
				rainfallProbability : 60,
			}]
		});
		weather.save(function (err, out) {
			should.not.exist(err);
			should.equal(out, weather);
			done();
		});
	});

});

