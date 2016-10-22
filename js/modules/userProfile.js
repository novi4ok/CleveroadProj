(function (angular) {
  'use strict';
  var userProfileModule = angular.module('userProfileModule', [])
  .factory('userProfile', function () {
    var userInfo;
    var userProfileObj = {
      setUserInfo: function (_userInfo) {
        userInfo = _userInfo;
      },
      getUserInfo: function() {
        return userInfo;
      },
      isLoggedIn: function() {
        return (userInfo && userInfo.email);
      },
    };

    return userProfileObj;
  });

  // "userInfo" directive
  userProfileModule.directive('userInfo', function ($timeout) {
    return {
      restrict: 'E',
      scope: {
        value: '=value',
        //isReset: '=isreset',
        //'updateChanges': '&onClick'
      },
      templateUrl: 'templates/userInfo.html',
      link: function (scope, elem, attrs) {
        //scope.isEdit = false;
        //scope.inputEdit = elem.find("input")[0];
        //scope.editEnable = function () {
        //  scope.isEdit = true;
        //  scope.isReset = false;
        //  $timeout(function () {
        //    scope.inputEdit.focus();
        //  });
        //}
        //scope.blurEdit = function (event) {
        //  if (!scope.form.inputValue.$error.required) {
        //    scope.isEdit = false;
        //    scope.updateChanges();
        //  }
        //};
      }
    };
  });

})(window.angular);
