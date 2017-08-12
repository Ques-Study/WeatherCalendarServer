var rest = require('restler');
var parser = require('xml2json');
const Weather = require('./weatherSchema.js');
const FILTERING_KEY_ARRAY = ["hour", "day", "temp", "sky", "pty", "pop"];

module.exports.fetch = function() {
    return new Promise(function(resolve, reject) {
        rest.get('http://www.kma.go.kr/wid/queryDFSRSS.jsp?zone=2723067100')
        .on('complete', function(data) {
            if(data instanceof Error){
                reject(error);
            } else {
                var apiResponse = JSON.parse(parser.toJson(data));
                resolve(filterJSON(FILTERING_KEY_ARRAY, apiResponse["rss"]["channel"]["item"]["description"]["body"]["data"]));
            }
        });
    });
}

module.exports.addWeather = function(weatherResponse) {
    return new Promise(function(resolve, reject){
    const todaysWeatherJson = filterWeatherJsonByDay(weatherResponse, 0);
    const tomorrowsWeatherJson = filterWeatherJsonByDay(weatherResponse, 1);
    var todaysWeather = parseWeather(todaysWeatherJson);
    var tomorrowsWeather = parseWeather(tomorrowsWeatherJson);
    saveWeather(tomorrowsWeather).then(function(tomorrowresult){
        saveWeather(todaysWeather).then(function(todayresult){
            resolve({"today":todayresult, "tomorrow":tomorrowresult})
        });
        resolve({"tomorrow":tomorrowresult});
    })
        .catch(function(error){
            reject(error);
        })
    })
}

function saveWeather(weather){
    return new Promise(function(resolve, reject){
        if(weather){
            weather.save(function(err, result){
                if(err) reject(err);
                resolve(result);
            })
            
        }
    })
}

function filterJSON(FILTERING_KEY_ARRAY, responseArray){
    var filteredArray = [];
    responseArray.forEach(function(responseElement) {
        var filteredUnitObject = {};
        FILTERING_KEY_ARRAY.forEach(function(key) {
            filteredUnitObject[key] = responseElement[key];
        }, this);
        filteredArray.push(filteredUnitObject);
    }, this);    
    return filteredArray;
}

function filterWeatherJsonByDay(weatherJson, day) {
    return weatherJson.filter(function(weatherElement) {
        return weatherElement.day == day;
    });
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