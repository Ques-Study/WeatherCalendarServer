const mongoose = require('mongoose');

module.exports.connect = function() {
	return new Promise(function(resolve, reject) {
		// TODO: extract host name
		mongoose.connect('mongodb://localhost:27017/weather', function(err, db) {
			if (err) {
				reject(err);
				return;
			}
			resolve(db);
		});
	});
}

