var logger = require('tracer').console({
    format: "{{timestamp}} [{{title}}] {{message}} (in {{path}}:{{line}})",
    dateformat: "dd-mm-yyyy HH:MM:ss TT"
});
var MongoClient = require('mongodb').MongoClient;
var MongoConnection = function (errorCallback) {
    var me = this;
    if (!errorCallback) {
        throw new Error("errorCallback is mandatory");
    }
    me.getConnection = function (opts, callback) {
        callback = callback || function () {
        };
        if (!opts) {
            return crashed(new Error("opts orgument should not be null"), false);
        }
        if (!opts.host || !opts.port || !opts.database) {
            return crashed(new Error("invalid opts:" + JSON.stringify(opts)), false);
        }
        var url;
        if (opts.auth) {
            if (!opts.username || !opts.password) {
                return crashed(new Error("invalid opts:" + JSON.stringify(opts)), false);
            }
            url = 'mongodb://' + opts.username + ":" + opts.password + "@" + opts.host + ':' + opts.port + '/'
                + opts.database;
        }
        else {
            url = 'mongodb://' + opts.host + ':' + opts.port + '/'
                + opts.database;
        }
        MongoClient.connect(url, {useNewUrlParser: true}, function (err, mdb) {
            if (err) {
                return crashed(new Error(err), false);
            }
            if (!mdb) {
                return crashed(new Error("some thing went wrong"), false);
            }
            var db = mdb.db(opts.database)
            callback(null, db);
        })
    };

    function crashed(err, isLogged) {
        if (!isLogged) {
            logger.error(err.stack)
            isLogged = true;
        }
        errorCallback(err, isLogged);
    }
};

module.exports = MongoConnection;