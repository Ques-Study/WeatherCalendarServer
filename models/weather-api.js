var rest = require('restler');
var parser = require('xml2json');
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
