var request = require('request');

var wirelesstags = {
    // Forms a valid request to authenticate against the wireless tag manager. Calls callback with a boolean indicating
    // success or failure.
    authenticate: function(username, password, callback) {
        request({
            method: 'POST',
            uri: 'https://www.mytaglist.com/ethAccount.asmx/Signin',
            json: true,
            jar: true,
            gzip: true,
            body: { email: username, password: password }
        }, function (error, response, body) {
            callback(!error);
        });
    },
    // Forms a valid request to get the latest tag list.
    getTagList: function(username, password, callback) {
        this.authenticate(username, password, function(authenticated) {
            if (authenticated) {
                request({
                    method: 'POST',
                    uri: 'https://www.mytaglist.com/ethClient.asmx/GetTagList2',
                    json: true,
                    jar: true,
                    gzip: true,
                    body: {}
                }, function (error, response, body) {
                    if (!error) {
                        callback(true, body.d);
                    } 
                    else {
                        callback(true, false);
                    }
                });
            }
            else {
                callback(false);
            }
        });
    }
};

module.exports = wirelesstags;