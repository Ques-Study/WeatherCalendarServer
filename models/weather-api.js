var rest = require('restler');
var parser = require('xml2json');
const Weather = require('./weatherSchema.js');
const FILTER_KEYS = ["hour", "day", "temp", "sky", "pty", "pop"];

module.exports.FILTERING_KEYS = FILTER_KEYS;

module.exports.fetch = function() {
    return new Promise(function(resolve, reject) {
        rest.get('http://www.kma.go.kr/wid/queryDFSRSS.jsp?zone=2723067100')
        .on('complete', function(data) {
            if(data instanceof Error){
                reject(error);
            } else {
                resolve(selectAndFilterJSON(data));
            }
        });
    });
}

function selectAndFilterJSON(data){
    var apiResponse = JSON.parse(parser.toJson(data));
    return filterWeatherJsons(apiResponse["rss"]["channel"]["item"]["description"]["body"]["data"]);
}

function filterWeatherJsons(weatherJsons) {
    var jsonGroupedByDay = filterWeatherJsonByDay(weatherJsons.map(filterWeatherJson));
    return convertJsonToWeather(jsonGroupedByDay);    
}

function filterWeatherJson(weatherJson) {
    var filteredWeatherJson = {};
    FILTER_KEYS.forEach(function(key) {
        filteredWeatherJson[key] = weatherJson[key];
    });
    return filteredWeatherJson;
}

function convertJsonToWeather(jsonGroupedByDay){
    var weatherObjectByDay = [];
    Object.keys(jsonGroupedByDay).forEach(function(key) {
        weatherObjectByDay.push(parseWeather(jsonGroupedByDay[key]));
    });
    return weatherObjectByDay;
}

function filterWeatherJsonByDay(weatherJson) {
    var filterWeatherJsons = {};
        weatherJson.forEach(function(weatherElement) {
            if (!filterWeatherJsons[weatherElement.day]){
                filterWeatherJsons[weatherElement.day] = [];
                filterWeatherJsons[weatherElement.day].push(weatherElement);
            } else {
                filterWeatherJsons[weatherElement.day].push(weatherElement);
            }
        });
    return filterWeatherJsons;
}

function parseWeather(weatherJson) {
    // TODO: Change into exception
    if (weatherJson.length == 0) {
        return null;
    }
    const now = new Date();
    const dailyWeather = new Weather();
    dailyWeather.date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + Number(weatherJson[0].day));
    const weathers = [];
    for (var i = 0; i < weatherJson.length; i++) {
        var weather = {
            hour: weatherJson[i].hour,
            temp: weatherJson[i].temp,
            skyCode: weatherJson[i].sky,
            rainfallCode: weatherJson[i].pty,
            rainfallProbability : weatherJson[i].pop
        };
        weathers.push(weather);
    }
    dailyWeather.weathers = weathers;

  return dailyWeather;
}