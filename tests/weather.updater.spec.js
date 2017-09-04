const should = require('should');
const mongoose = require('mongoose');
const Weather = require("../models/weatherSchema");
const weatherUpdater = require("../models/weatherUpdater");
const weatherApi = require("../models/weather-api");

describe('Weather Updater', function() {
	before(function(done) {
		mongoose.Promise = global.Promise;
		this.connection = mongoose.connect('mongodb://localhost:27017/worktest', function(err, db) {
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
		if(this.connection != 'undefined') {
			Weather.collection.drop();
		}
	});

	it('should update weather', function(done) {
		const weather = createDummyWeather(0, 0, 8);
		weatherUpdater.updateWeather([weather]).then(function(err) {
			should.not.exist(err);
			Weather.findOne({ date: weather.date }, function(err, weatherFound) {
				should.not.exist(err);
				compare(weatherFound, weather);
				done();
			});
		});
	});

	it('should update weather in db', function(done) {
		const firstWeather = createDummyWeather(0, 0, 5);
		const secondWeather = createDummyWeather(0, 1, 5);
		const weather = createDummyWeather(0, 0, 6);
		weatherUpdater.updateWeather([firstWeather]).then(function(err) {
			should.not.exist(err);
			weatherUpdater.updateWeather([secondWeather]).then(function(err) {
				should.not.exist(err);
				Weather.findOne({ date: firstWeather.date }, function(err, updatedWeather) {
					should.not.exist(err);
					compare(updatedWeather, weather);
					done();
				});
			});
		});
	});

});

function compare(lhs, rhs) {
	should.equal(lhs.date.getTime(), rhs.date.getTime());
	should.equal(lhs.weathers.length, rhs.weathers.length);
	lhs.weathers.forEach(function(weather, index) {
		otherWeather = rhs.weathers[index];
		should.equal(weather.hour, otherWeather.hour);
		should.equal(weather.temp, otherWeather.temp);
		should.equal(weather.skyCode, otherWeather.skyCode);
		should.equal(weather.rainfallCode, otherWeather.rainfallCode);
		should.equal(weather.rainfallProbability, otherWeather.rainfallProbability);
	});
}

function checkWeathersHaveProperties (weathersArray) {
	weathersArray.forEach(function(weatherObject) {
		weatherObject["weathers"].forEach(function(weathers) {
			var weatherKey = Object.keys(weathers._doc);
			var schemaKey = Object.keys(Weather.schema.obj.weathers[0]);
			weatherKey.should.containDeep(schemaKey);
		}, this);
	}, this);
}

function createDummyWeather(day, hourBase, hourCount) {
	var date = new Date(0, 0, day);
	const weather = new Weather({
		date: date
	});
	for (var i = 0; i < hourCount; i++) {
		weather.weathers.push({
			hour: (3*hourBase) + (3*i),
			temp: hourBase + i + day,
			skyCode: hourBase + i + day,
			rainfallCode: hourBase + i + day,
			rainfallProbability: hourBase + i + day
		});
	}

return weather;

}

