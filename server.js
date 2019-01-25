const express = require('express');
const bodyParser=require('body-parser');
const path = require('path');
const apiRoutes=require('./routes/apis/apiRoutes');
const viewRoutes=require('./routes/viewRoutes/viewRoutes');
const async=require('async');
const MongoConnection = require('./classes/mongoConnection');

var logger = require('tracer').console({
    format: "{{timestamp}} [{{title}}] {{message}} (in {{path}}:{{line}})",
    dateformat: "dd-mm-yyyy HH:MM:ss TT"
});

const app=express();

// Setup View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); //specifies the engine we want to use
app.engine('ejs', require('ejs').renderFile); //renders files with html extension
// Set Static Folder
app.use(express.static(path.join(__dirname, 'client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use('/views', viewRoutes); //sets our home page route
app.use('/api', apiRoutes); //sets our api call routes
app.use('/',function (req,res) {
    return res.redirect('/views');
})
//Starts our server

var crashed = function (err, isLogged) {
    if (!isLogged) {
        logger.error(err.stack)
        isLogged = true;
    }
    process.exit()
}

function init() {
    app.set("crashed", crashed);
    var config = require("./config/config.json");
    app.set("config", config);

    var openRequiredConnections = [
        function getMongoConnection(callback) {
            var mongoConnection = new MongoConnection(crashed);
            mongoConnection.getConnection({
                host: config.mongodb.host,
                port: config.mongodb.port,
                auth: config.mongodb.auth,
                username: config.mongodb.username,
                password: config.mongodb.password,
                database: config.mongodb.database,
            }, function (err, mdb) {
                app.set("mdb", mdb);
                console.log("mongo connection started successfully");
                return callback();
            });
        }
    ];

    async.parallel(openRequiredConnections, function (err, results) {
        if (err) {
            return crashed(new Error(err), false);
        }
        logger.log("all required connections opened");
        var config = app.get("config");
        var server = app.listen(config.server.port, function () {
            console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
        });
    });
}

init();

module.exports=app;