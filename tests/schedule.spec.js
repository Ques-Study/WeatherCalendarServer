const sinon = require('sinon');
const should = require('should');
const jobScheduler = require('../models/job-scheduler');
const anHourInMillisec = 60 * 60 * 1000;

var mockClock;

describe('Job scheduler', function () {
	before(function() {
		prepareMockClock();
	})

	after(function() {
		resetMockClock();
	})
  
	it('should fire event on next midnight', function (done) {
		const timeoutInMillisec = getTimeoutAfterHours(24);
		jobScheduler.scheduleWithHours([0], function() {
			const currentHour = new Date().getHours();
			currentHour.should.equal(0);
			done();
		});
		setTimeout(function() {
			should.exist(null);
			job.cancel();
			done();
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
  return timeoutInHour * anHourInMillisec;
}

