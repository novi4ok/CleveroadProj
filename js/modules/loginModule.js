(function (angular) {
  'use strict';
  var loginModule = angular.module('loginModule', ['userProfileModule']);

  // loginController
  loginModule.controller('loginController', ['$scope', '$window', 'userProfile', function ($scope, $window, userProfile) {
    $scope.isNoValid = false;
    $scope.userEmail = (localStorage["testProj_userEmail"] ? localStorage["testProj_userEmail"] : "");
    $scope.userPassword = (localStorage["testProj_userPassword"] ? localStorage["testProj_userPassword"] : "");
    $scope.rememberMe = !!(localStorage["testProj_rememberMe"]);

    $scope.clickLogin = function (form) {
      $scope.isNoValid = !form.$valid;
      if (!form.$valid)
        return;

      if ($scope.rememberMe) {
        localStorage["testProj_userEmail"] = $scope.userEmail;
        localStorage["testProj_userPassword"] = $scope.userPassword;
        localStorage["testProj_rememberMe"] = true;
      } else {
        delete localStorage["testProj_userEmail"];
        delete localStorage["testProj_userPassword"];
        delete localStorage["testProj_rememberMe"];
      }

      userProfile.setUserInfo({ name: 'test', email: $scope.userEmail });
      $window.location.href = '#/';
      //$scope.errorMessage = "Incorrect email!";
    };

  }]);


})(window.angular);
