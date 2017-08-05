const mongoose = require('mongoose');

const weatherSchema = mongoose.Schema({
  minTem : Number,
  maxTem : Number, 
  windSpeed : Number,
  humidity : Number,
  weather : String
});

module.exports = mongoose.model('Weather', weatherSchema);
