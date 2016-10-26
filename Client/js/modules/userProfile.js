// User profile module - logging
(function (angular) {
  'use strict';
  var userProfileModule = angular.module('userProfileModule', ['utilsModule'])
  .factory('userProfile', ['$rootScope', '$window', '$location', 'utils', function ($rootScope, $window, $location, utils) {
    var self;
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

        utils.setLoadingApplication(true);

        utils.httpRequest(data, function success(response) {
          if (!response.error) {
            if (response.data && response.data.user && response.data.user.sessionID) {
              var user = response.data.user;
              self.setSession(user.sessionID, user);
            } 
          } else {
            $location.path('/login');
          }

          utils.setLoadingApplication(false);
        }, function error(response, status) {
          $location.path('/login');
          utils.setLoadingApplication(false);
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

        var session = self.getSession();
        data.sessionID = (session ? session.id : '');

        utils.httpRequest(data, function success(response) {
          var errorMessage = "";
          if (!response.error) {
            if (response.data && response.data.user && response.data.user.sessionID) {
              var user = response.data.user;
              self.setSession(user.sessionID, user);
            } else {
              errorMessage = "User's session doesn't exist!";
            }
          } else {
            errorMessage = response.error;
          }

          if (callback)
            callback(errorMessage);
        }, function error(response, status, headers) {
          var errorMessage = (response ? "Error: " + response : "Error: status=" + status);
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

        utils.httpRequest(data, function success(response) {
          $rootScope.isUserInfoShow = false;
          $rootScope.userActive = null;

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

        utils.httpRequest(data, function success(response) {
          var errorMessage = "";
          if (!response.error) {
            if (response.data && response.data.user && response.data.user.sessionID) {
              var user = response.data.user;
              self.setSession(user.sessionID, user);
            }
          } else {
            errorMessage = response.error;
          }
          if (callback)
            callback(errorMessage);
        }, function error(response, status, headers) {
          var errorMessage = (response ? "Error: " + response : "Error: status=" + status);
          if (callback)
            callback(errorMessage);
        });
      },

      changePassword: function (userParams, callback) {
        if (!userParams)
          return;

        var action = "changePassword";
        var data = {
          action: action,
          user: userParams,
        };

        var session = self.getSession();
        data.sessionID = (session ? session.id : '');

        utils.httpRequest(data, function success(response) {
          var errorMessage = "";
          if (!response.error) {
            if (response.data && response.data.user && response.data.user.sessionID) {
              var user = response.data.user;
              self.setSession(user.sessionID, user);
            }
          } else {
            errorMessage = response.error;
          }
          if (callback)
            callback(errorMessage);
        }, function error(response, status, headers) {
          var errorMessage = (response ? "Error: " + response : "Error: status=" + status);
          if (callback)
            callback(errorMessage);
        });
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
