const mongoose = require('mongoose');

module.exports.connect = function() {
	return new Promise(function(resolve, reject) {
		// TODO: extract host name
		mongoose.Promise = global.Promise;
		mongoose.connect('mongodb://wc_mongo:27017/weather', { useMongoClient:true }, function(err, db) {
			if (err) {
				reject(err);
				return;
			}
			resolve(db);
		});
	});
}

