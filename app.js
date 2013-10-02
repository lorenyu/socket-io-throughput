var express = require('express'),
    fs = require('fs'),
    http = require('http'),
    path = require('path'),
    socketio = require('socket.io'),
    Client = require('./core/Client'),
    util = require('./util');

var app = express(),
    server = new http.Server(app),
    io = socketio.listen(server);

io.configure(function () { 
    io.set("transports", ["xhr-polling"]); 
    io.set("polling duration", 10); 
});

var clients = {};
io.on('connection', function (socket) {
    var client = new Client(socket);
    clients[client.id] = client;
});

app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser(process.env.SECRET || 'secret'));
app.use(function(req, res, next) {
    if (!req.signedCookies.session) {
        res.cookie('session', { id: util.generateId() }, { signed: true, httpOnly: true });
    }
    next();
});
app.use(express.static(__dirname + '/public'));
app.use(express.methodOverride());

app.get('/', function(req, res) {
    res.render('index');
});

var port = process.env.PORT || 3000;
server.listen(port, function() {
    console.log("Listening on " + port);
});