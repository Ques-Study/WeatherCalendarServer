var sinon = require('sinon');
var should = require('should');
var schedule = require('node-schedule');
var mockClock;
const anHourInMillisec = 60 * 60 * 1000;

describe('Scheduler', function () {
  before(function() {
    prepareMockClock();
  })

  after(function() {
    resetMockClock();
  })
  
  it('should fire event on next midnight', function (done) {
    const timeoutInMillisec = getTimeoutAfterHours(24);
    const hoursToMidnight = 24 - new Date().getHours();
    var dateToFire = createDateAfterHours(hoursToMidnight);
    dateToFire = resetDateBelowHours(dateToFire);

    var rule = new schedule.RecurrenceRule();
    rule.hour = dateToFire.getHours();
    rule.minute = 0;

    var job = new schedule.Job(function() {
      dateToFire.getTime().should.equal(new Date().getTime());
      job.cancel();
      done();
    });

    job.schedule(rule);

    setTimeout(function() {
      should.exist(null);
      job.cancel();
      done();
    }, timeoutInMillisec);

    mockClock.tick(timeoutInMillisec);
  });
});

function getTimeoutAfterHours(hours) {
  const timeoutInHour = hours;
  return timeoutInHour * anHourInMillisec;
}

function createDateAfterHours(hours) {
  const date = new Date();
  return new Date(date.getTime() + hours * anHourInMillisec);
}

function resetDateBelowHours(date) {
  date.setMinutes(0, 0, 0);
  return date;
}

function prepareMockClock() {
  mockClock = sinon.useFakeTimers(new Date());
}

function resetMockClock() {
  mockClock.restore();
}

