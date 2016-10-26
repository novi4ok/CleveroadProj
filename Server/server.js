
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var app = express();

var serverMgrModule = require('./js/ServerMgr.js');
var serverMgr = new serverMgrModule.ServerMgr();


app.use(cookieParser());
app.use(session({
  key: 'A_SESSION_KEY',
  secret: 'ssshhhhh',
}));

try {
  
  //app.use(function (req, res, next) {
  //  res.header('Access-Control-Allow-Credentials', true);
  //  //res.header('Access-Control-Allow-Origin', "*");
  //  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  //  //res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  //  next();
  //});

  app.use(function (request, response, next) {

    response.header('Access-Control-Allow-Credentials', true);
    response.header('Access-Control-Allow-Origin', "*");

    var objResponse = {};

    try {
      serverMgr.requestHandle(objResponse, request, response);

    } catch (ex) {
      objResponse.error = "Server exception: " + ex;
      response.end(JSON.stringify(objResponse));
    }

  }).listen(80);
  console.log("Server running at localhost:80 /");
} catch (ex) { }

