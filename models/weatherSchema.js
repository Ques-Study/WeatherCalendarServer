const mongoose = require('mongoose');

const weatherSchema = mongoose.Schema({
  minTem : String,
  maxTem : String, 
  windSpeed : String,
  humidity : String,
  weather : String
});

module.exports = mongoose.model('dailyWeather', weatherSchema);
