var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var redis = require('connect-redis')(session);
var log4js = require('log4js');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//*optional* port  Default:6379
//*optional* host  Defalut:127.0.0.1
app.use(session({ store: new redis({prefix:'zclion'}), 
        resave:false,
        saveUninitialized:false,
        secret: 'zclion' }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.get('/doLogin', authentication);
function authentication(req, res, next) {
    if (!req.session.username) {
        res.render('login',{ title: 'login',message:
            '请先登录'});
    }
    next();
}

log4js.configure({
    appenders: [
        {
            type: "file",
            maxLogSize: 10240,
            filename: 'logs/SimpleChat.log',
            backups:0,
            category: [ 'cheese','console' ]
        },
        {
            type: "console"
        }
    ],
    replaceConsole: true
});
app.use(log4js.connectLogger(log4js.getLogger('normal'), {level:'auto', format:':method :url'}));

exports.logger=function(name){
    var logger = log4js.getLogger(name);
    logger.setLevel('INFO');
    return logger;
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
