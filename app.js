var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var weathers = require('./routes/weathers');

const mongooseUtils = require('./models/mongoose-utils');
const jobScheduler = require('./models/job-scheduler');
const weatherAPI = require('./models/weather-api');
const weatherUtils = require('./models/weather-utils');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/', users);
app.use('/', weathers);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// TODO: Consider adding logger to project
mongooseUtils.connect().then(function(db) {
  jobScheduler.scheduleWithHours([0, 12], function() {
    console.log("Job fired at: " + new Date());
    weatherAPI.fetch("2723067100").then(function(weathers) {
      return weatherUtils.saveWeathers(weathers);
    }).then(function() {
      console.log("Saved.");
    }).catch(function(err) {
      console.log(err);
    });
  });
}).catch(function(err) {
  console.log("Error occurred while connecting to database: " + err);
});

module.exports = app;
