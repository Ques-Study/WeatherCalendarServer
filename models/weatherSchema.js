const mongoose = require('mongoose');

const weatherSchema = mongoose.Schema({
	date: Date,
	zoneCode: Number,
	weathers: [{
		hour: Number,
		temp: Number,
		skyCode: Number,
		rainfallCode: Number,
		rainfallProbability: Number
	}]
});

module.exports = mongoose.model('Weather', weatherSchema);
