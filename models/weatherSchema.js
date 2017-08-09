const mongoose = require('mongoose');

const weatherSchema = mongoose.Schema({
  date: Date,
  weathers: [{
    hour: Number,
    temperature: Number,
    skyCode: Number,
    rainfallCode: Number,
    rainfallProbability: Number
  }]
});

module.exports = mongoose.model('Weather', weatherSchema);
