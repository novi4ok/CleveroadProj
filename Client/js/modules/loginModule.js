(function (angular) {
  'use strict';
  var loginModule = angular.module('loginModule', ['userProfileModule']);

  // loginController
  loginModule.controller('loginController', ['$scope', '$window', '$location', 'userProfile', function ($scope, $window, $location, userProfile) {
    var self;

    var loginCtrl = {
      constructor: function () {
        self = this;
        $scope.isNoValid = false;
        $scope.isLoginProcessing = false;
        $scope.userEmail = ($window.localStorage["testProj_userEmail"] ? $window.localStorage["testProj_userEmail"] : "");
        $scope.userPassword = ($window.localStorage["testProj_userPassword"] ? $window.localStorage["testProj_userPassword"] : "");
        $scope.rememberMe = !!($window.localStorage["testProj_rememberMe"]);

        var loginFormElem = angular.element(document.querySelector("#loginForm"));
        loginFormElem.find("input").bind("keydown", function () {
          $scope.isNoValid = false;
        });

        $scope.clickLogin = self.clickLogin;
      },

      clickLogin: function (form) {
        $scope.isNoValid = !form.$valid;
        if (!form.$valid)
          return;

        if ($scope.rememberMe) {
          $window.localStorage["testProj_userEmail"] = $scope.userEmail;
          $window.localStorage["testProj_userPassword"] = $scope.userPassword;
          $window.localStorage["testProj_rememberMe"] = true;
        } else {
          delete $window.localStorage["testProj_userEmail"];
          delete $window.localStorage["testProj_userPassword"];
          delete $window.localStorage["testProj_rememberMe"];
        }

        $scope.isLoginProcessing = true;

        var userParams = {
          email: $scope.userEmail,
          password: $scope.userPassword
        };
        userProfile.login(userParams, function (errorMessage) {
          $scope.isLoginProcessing = false;
          if (errorMessage) {
            $scope.errorMessage = errorMessage;
          } else {
            $location.path("/");
          }
        });
      }
    };

    loginCtrl.constructor();
    return loginCtrl;
  }]);

})(window.angular);
