const schedule = require('node-schedule');
const anHourInMillisec = 60 * 60 * 1000;

module.exports.scheduleWithHours = function(hours, callback) {
	const normalizedHours = normalizeHours(hours);
	scheduleWithNormalizedHours(normalizedHours, callback);
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
	hours.forEach(function(hour) {
		const rule = createScheduleRuleWithHour(hour);
		schedule.scheduleJob(rule, callback);
	});
}

function createScheduleRuleWithHour(hour) {
	const rule = new schedule.RecurrenceRule();
	rule.hour = hour;
	rule.minute = 0;

	return rule;
}

function getTimeoutAfterHour(hour) {
	const timeoutInHour = hour;
	return timeoutInHour * anHourInMillisec;
}

function createDateAfterHour(hour) {
	const date = new Date();
	return new Date(date.getTime() + hour * anHourInMillisec);
}

function resetDateBelowHour(date) {
	date.setMinutes(0, 0, 0);
	return date;
}

