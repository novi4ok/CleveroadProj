exports.ServerMgr = function () {
  var self;

  var _ = require('underscore');
  var querystring = require('querystring');

  var userMgrModule = require('./UserMgr.js');
  var userMgr = new userMgrModule.UserMgr();

  var serverMgrObj = {
    constructor: function () {
      self = this;

      setInterval(self.updateInterval, 300);
    },

    updateInterval: function () {
      if (userMgr)
        userMgr.updateMgr();
    },

    requestHandle: function (objResponse, request, response) {
      userMgr.setRequest(request);

      if (request.method === "POST") {
        this.processPOST(request, response);
      }
      //else if (request.method === "GET") {
      //  this.processGET(request, response);
      //}
      else {
        objResponse.error = "ERROR: UNKNOWN REQUEST";
        response.end(JSON.stringify(objResponse));
      }
    },

    responseCallbackPOST: function (response, dataRequest, objResponse) {
      self.responseCallbackPOSTExtend(response, dataRequest, objResponse);
    },
    responseCallbackPOSTExtend: function (response, dataRequest, objResponse, contentType) {
      if (contentType) {
        response.setHeader('Content-Type', contentType);
      }

      response.statusCode = 200;
      response.end(JSON.stringify(objResponse));
    },

    // hadling of the POST request
    processPostData: function (request, response, callback) {
      var queryData = "";
      if (typeof callback !== 'function') return null;

      if (request.method == 'POST') {
        request.on('data', function (data) {
          queryData += data;
        });
        request.on('end', function () {
          request.post = querystring.parse(queryData);
          var postKey = _.keys(request.post);
          var dataRequest = 0;
          try {
            dataRequest = JSON.parse(postKey[0]);
          } catch (ex) {
          }
          callback();
        });

      } else {
        response.writeHead(405, { 'Content-Type': 'text/plain' });
        response.end();
      }
    },

    processPOST: function (request, response) {
      var objResponse = {};

      self.processPostData(request, response, function () {
        var dataRequest;
        var postKey = _.keys(request.post);
        if (postKey.length > 0) {
          try {
            dataRequest = JSON.parse(postKey[0]);
          } catch (ex) {
            dataRequest = request.post;
          }
        }

        if (dataRequest) {

          //if (!userMgr.isActionSecure(dataRequest.action)) {
          //  if (!userMgr.isSessionExist(dataRequest.sessionID)) {
          //    objResponse.error = "User's session doesn't exist!";
          //    response.end(JSON.stringify(objResponse));
          //    return;
          //  } else if (!userMgr.hasAccess(dataRequest.action, dataRequest.sessionID)) {
          //    objResponse.error = "User doesn't have the access to this operation!";
          //    response.end(JSON.stringify(objResponse));
          //    return;
          //  }
          //}

          switch (dataRequest.action) {
            case "login":
              {
                userMgr.login(dataRequest, objResponse, function () {
                  self.responseCallbackPOST(response, dataRequest, objResponse);
                });
                break;
              }
            case "logout":
              {
                userMgr.logout(dataRequest, objResponse, function () {
                  self.responseCallbackPOST(response, dataRequest, objResponse);
                });
                break;
              }
            case "pingSession":
              {
                userMgr.pingSession(dataRequest, objResponse, function () {
                  self.responseCallbackPOST(response, dataRequest, objResponse);
                });
                break;
              }
            case "saveProfile":
              {
                userMgr.saveProfile(dataRequest, objResponse, function () {
                  self.responseCallbackPOST(response, dataRequest, objResponse);
                });
                break;
              }
            case "changePassword":
              {
                userMgr.changePassword(dataRequest, objResponse, function () {
                  self.responseCallbackPOST(response, dataRequest, objResponse);
                });
                break;
              }

          }
        }

      });
    },
    
  };
  serverMgrObj.constructor();
  return serverMgrObj;

};