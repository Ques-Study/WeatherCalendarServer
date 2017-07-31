const schedule = require('node-schedule');
const AN_HOUR_IN_MILLISEC = 60 * 60 * 1000;

module.exports.scheduleWithHours = function(hours, callback) {
	const normalizedHours = normalizeHours(hours);
	return scheduleWithNormalizedHours(normalizedHours, callback);
}

function normalizeHours(targetHours) {
	const normalizedHours = [];
	targetHours.forEach(function(targetHour) {
		const normalizedHour = normalizeHour(targetHour)
		normalizedHours.push(normalizedHour);
	});

	return normalizedHours;
}

function normalizeHour(targetHour) {
	const currentHour = new Date().getHours();
	const hourLeft = (targetHour > currentHour ? targetHour : targetHour + 24) - currentHour;
	var dateToFire = createDateAfterHour(hourLeft);
	dateToFire = resetDateBelowHour(dateToFire);

	return dateToFire.getHours();
}

function scheduleWithNormalizedHours(hours, callback) {
	const rule = createScheduleRuleWithHours(hours);
	return schedule.scheduleJob(rule, function() {
		callback();
	});
}

function createScheduleRuleWithHours(hours) {
	const rule = new schedule.RecurrenceRule();
	rule.hour = hours;
	rule.minute = 0;

	return rule;
}

function getTimeoutAfterHour(hour) {
	const timeoutInHour = hour;
	return timeoutInHour * AN_HOUR_IN_MILLISEC;
}

function createDateAfterHour(hour) {
	const date = new Date();
	return new Date(date.getTime() + hour * AN_HOUR_IN_MILLISEC);
}

function resetDateBelowHour(date) {
	date.setMinutes(0, 0, 0);
	return date;
}

