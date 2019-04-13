var request = require('request');

var wirelesstags = {
    // Forms a valid request to get the latest tag list.
    getTagList: function(token, callback) {
        request({
            method: 'POST',
            uri: 'https://my.wirelesstag.net/ethClient.asmx/GetTagList2',
            json: true,
            jar: true,
            gzip: true,
            headers: {
              'Authorization': 'Bearer ' + token
            },
            body: {}
        }, function (error, response, body) {
            if (!error) {
                callback(body.d);
            } 
            else {
                callback(false);
            }
        });
    }
};

module.exports = wirelesstags;
