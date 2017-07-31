const sinon = require('sinon');
const should = require('should');
const jobScheduler = require('../models/job-scheduler');
const AN_HOUR_IN_MILLISEC = 60 * 60 * 1000;

var mockClock;

describe('Job scheduler', function () {
	before(function() {
		prepareMockClock();
	})

	after(function() {
		resetMockClock();
	})
  
	it('should fire events at every 6 hours from midnight', function (done) {
		const timeoutInMillisec = getTimeoutAfterHours(48);
		const hours = [0, 6, 12, 18];
		const job = jobScheduler.scheduleWithHours(hours, function() {
			const currentHour = new Date().getHours();

			const index = hours.indexOf(currentHour);
			index.should.be.above(-1);

			hours.splice(index, 1);
			if (hours.length == 0) {
				job.cancel();
				done();
			}
		});
		setTimeout(function() {
			hours.should.be.empty();
			job.cancel();
		}, timeoutInMillisec);

		mockClock.tick(timeoutInMillisec);
	});
});

function prepareMockClock() {
	mockClock = sinon.useFakeTimers(new Date());
}

function resetMockClock() {
	mockClock.restore();
}

function getTimeoutAfterHours(hours) {
	const timeoutInHour = hours;
	return timeoutInHour * AN_HOUR_IN_MILLISEC;
}

