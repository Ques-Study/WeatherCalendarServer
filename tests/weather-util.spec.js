const should = require('should');
const mongoose = require('mongoose');
const Weather = require("../models/weatherSchema");
const weatherUtils = require("../models/weather-utils");

describe('Weather Utils', function() {
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
		if(this.connection != 'undefined') {
			Weather.collection.drop();
		}
	});

	it('should insert weather', function(done) {
		const weather = createDummyWeather(0, 0, 8);
		weatherUtils.saveWeathers([weather]).then(function(err) {
			should.not.exist(err);
			Weather.findOne({ date: weather.date }, function(err, weatherFound) {
				should.not.exist(err);
				assertEquals(weatherFound, weather);
				done();
			});
		});
	});

	it('should update weather in db', function(done) {
		const firstWeather = createDummyWeather(0, 0, 5);
		const secondWeather = createDummyWeather(0, 1, 5);
		const weather = createDummyWeather(0, 0, 6);
		weatherUtils.saveWeathers([firstWeather]).then(function(err) {
			should.not.exist(err);
			return weatherUtils.saveWeathers([secondWeather]);
		}).then(function(err) {
			should.not.exist(err);
			Weather.findOne({ date: firstWeather.date }, function(err, updatedWeather) {
				should.not.exist(err);
				assertEquals(updatedWeather, weather);
				done();
			});
		});
	});
	
	it('should load weather', function(done) {
		const weather = createDummyWeather(0, 0, 6);
		weatherUtils.saveWeathers([weather]).then(function(err) {
			should.not.exist(err);
			weatherUtils.loadWeather(weather.date, weather.zoneCode).then(function(data) {
				should.not.exist(err);
				assertEquals(weather, data);
				done();
			});
		});
	});

});

function assertEquals(lhs, rhs) {
	should.equal(lhs.date.getTime(), rhs.date.getTime());
	should.equal(lhs.zoneCode, rhs.zoneCode);
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

function createDummyWeather(day, hourBase, hourCount) {
	var date = new Date(0, 0, day);
	const weather = new Weather({
		date: date,
		zoneCode: 123456
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

