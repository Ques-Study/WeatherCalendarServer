var rest = require('restler');
var parser = require('xml2json');

module.exports.fetch = function() {
    
    return new Promise(function(resolve, reject) {
        var result = {};
        rest.get('http://www.kma.go.kr/wid/queryDFSRSS.jsp?zone=2723067100')
        .on('complete', function(data) {
            if(data instanceof Error){
                reject(error);
            } else {
                resolve(JSON.parse(parser.toJson(data)));
            }
        });
    });
}
