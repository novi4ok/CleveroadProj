(function (angular) {
  'use strict';
  var userProfileModule = angular.module('userProfileModule', [])
  .factory('userProfile', ['$rootScope', '$http', '$window', '$location', function ($rootScope, $http, $window, $location) {
    var self;
    var userInfo;
    var prefixStorage = "testingApp_";

    var session = {
      id: "",
      user: null,
      isLogged: false,
    };

    var userProfileObj = {
      constructor: function() {
        self = this;
      },

      setUserInfo: function (_userInfo) {
        userInfo = _userInfo;
      },
      getUserInfo: function() {
        return userInfo;
      },
      isLoggedIn: function() {
        return (userInfo && userInfo.email);
      },



      getSession: function () {
        if (!session || !session.id) {
          var sessionData = $window.localStorage[prefixStorage + "session"];
          if (sessionData) {
            try {
              session = JSON.parse(sessionData);
            } catch (ex) { }
          }
        }
        return session;
      },
      setSession: function (sessionID, user) {
        if (sessionID && user) {
          if (!session)
            session = {};
          session.id = sessionID;
          session.user = user;
          session.isLogged = true;
          $window.localStorage[prefixStorage + "session"] = JSON.stringify(session);

          $rootScope.isUserInfoShow = true;
          $rootScope.userActive = user;
        }
      },

      pingSession: function () {
        var session = self.getSession();
        var action = "pingSession";
        var data = {
          action: action,
          sessionID: (session ? session.id : '')
        };

        self.setLoadingApplication(true);

        self.httpRequest(data, function success(response) {
          if (!response.error) {
            if (response.data && response.data.user && response.data.user.sessionID) {
              var user = response.data.user;
              self.setSession(user.sessionID, user);
            } 
          } else {
            $location.path('/login');
          }

          self.setLoadingApplication(false);
        }, function error(response, status) {
          self.setLoadingApplication(false);
        });

      },

      login: function (userParams, callback) {
        if (!userParams)
          return;

        var action = "login";
        var data = {
          action: action,
          user: userParams,
        };

        self.httpRequest(data, function success(response) {
          var errorMessage = "";
          if (!response.error) {
            if (response.data && response.data.user && response.data.user.sessionID) {
              var user = response.data.user;
              self.setSession(user.sessionID, user);
            } else {
              errorMessage = "User's session doesn't exist!";
            }
          } else {
            if (!response.error || response.error === "")
              errorMessage = "UNKNOWN ERROR";
            else
              errorMessage = response.error;
          }

          if (callback)
            callback(errorMessage);
        }, function error(response, status, headers) {
          var errorMessage = (response ? "Error: " + response : "");
          if (!errorMessage) {
            errorMessage += "Error: status=" + status;
          }
          if (callback)
            callback(errorMessage);
        });
      },

      logout: function (callback) {
        var session = self.getSession();
        var action = "logout";
        var data = {
          action: action,
          sessionID: (session ? session.id : '')
        };

        self.httpRequest(data, function success(response) {
          if (callback)
            callback();
        }, function error(response, status, headers) { });
      },

      saveProfile: function (userParams, callback) {
        if (!userParams)
          return;

        var action = "saveProfile";
        var data = {
          action: action,
          user: userParams,
        };

        self.httpRequest(data, function success(response) {
          var errorMessage = "";
          if (!response.error) {
            if (response.data && response.data.user && response.data.user.sessionID) {
              var user = response.data.user;
              self.setSession(user.sessionID, user);
            }
          } else {
            if (!response.error || response.error === "")
              errorMessage = "UNKNOWN ERROR";
            else
              errorMessage = response.error;
          }
          if (callback)
            callback(errorMessage);
        }, function error(response, status, headers) {
          var errorMessage = (response ? "Error: " + response : "");
          if (!errorMessage) {
            errorMessage += "Error: status=" + status;
          }
          if (callback)
            callback(errorMessage);
        });
      },

      httpRequest: function (data, success, error) {
        if (!data || !success)
          return;

        var session = self.getSession();
        data.sessionID = (session ? session.id : '');

        //var url = CONST.SERVER.PATH();
        var url = "http://localhost:80/";

        var req = {
          method: 'POST',
          url: url,
          //url: url,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': "application/json, text/plain, */*",
          },
          data: JSON.stringify(data)
        };

        //if (data.isNotified)
        //  Utils.showProcessBar(true);

        $http(req).
          success(function (response, status, headers, config) {
            if (success)
              success(response);
          }).
          error(function (response, status, headers, config) {
            if (error)
              error(response, status);
          });
      },

      setLoadingApplication: function (isLoad) {
        var loadingAppElem = angular.element(document.querySelector("#loadingApp"));
        var mainContainerElem = angular.element(document.querySelector("#mainContainer"));
        if (isLoad) {
          loadingAppElem.css("display", "block");
          mainContainerElem.css("display", "none");
        } else {
          loadingAppElem.css("display", "none");
          mainContainerElem.css("display", "block");
        }
      },

    };

    userProfileObj.constructor();
    return userProfileObj;
  }]);

  // "userInfo" directive
  userProfileModule.directive('userInfo', ['userProfile', '$location', function (userProfile, $location) {
    return {
      restrict: 'E',
      scope: {
        value: '=value'
      },
      templateUrl: 'templates/userInfo.html',
      link: function (scope, elem, attrs) {
        scope.clickLogout = function() {
          userProfile.logout(function() {
            $location.path('/login');
          });
        }
      }
    };
  }]);

})(window.angular);
