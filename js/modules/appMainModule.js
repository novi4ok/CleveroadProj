(function (angular) {
  'use strict';
  var appMain = angular.module('appMain', ['ngRoute', 'loginModule', 'userProfileModule']);
  
  // config
  appMain.config(["$routeProvider", function ($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "templates/goodsList.html",
        controller: "goodsListController"
      })
      .when("/login", {
        templateUrl: "templates/loginPage.html",
        controller: "loginController"
      })
      .when('/404', {
        templateUrl: 'templates/404.html'
        //controller: 'RedirectCtrl'
      })
      .otherwise({
        redirectTo: '/404'
      });
      //.when("/description/:taskId", {
      //  templateUrl: "templates/taskDescription.html",
      //  controller: "taskDescriptionController"
      //});
    
  }]);
  
  // appController
  appMain.controller('appController', [
    '$scope', '$window', 'userProfile', function ($scope, $window, userProfile) {
      if (false && !userProfile.isLoggedIn()) {
        $window.location.href = '#/login';
      } else {
        userProfile.setUserInfo({ name: 'test', email: 'tefa@mail' });
        $scope.userName = userProfile.getUserInfo().name;
        $scope.userEmail = userProfile.getUserInfo().email;

        
        $window.location.href = '#/';
      }
    }
  ]);


  // appController
  appMain.controller('goodsListController', [
    '$scope', '$window', 'userProfile', function ($scope, $window, userProfile) {
      $scope.userInfo = userProfile.getUserInfo();

      $scope.goodsList = [];

      for (var i = 0; i < 100; i++) {
        $scope.goodsList.push(
        {
          id: i,
          name: 'name' + i,
          price: i * 1000.23,

        });
      }
    }
  ]);

  appMain.filter('priceFilter', function () {
    return function (value) {
      if (!value)
        value = 0;
      return parseFloat(value).toFixed(2).toString().replace('.', ',');
    };
  });

  appMain.factory('userInfo', function () {
    var taskCollectionObj = {

    };

    return taskCollectionObj;
  });


  // "timeValue" filter
  appMain.filter('timeValue', function () {
    function timeValue(input) {
      if (typeof input == 'undefined') {
        return '';
      }
      var intPart = parseInt(input);
      var floatPart = input - intPart;
      var value = intPart + ' hours';
      if (floatPart > 0) {
        value += ' ' + Math.round(floatPart * 60) + ' minutes';
      }
      return value;
    }
    return timeValue;
  });

  // "editProperty" directive
  appMain.directive('editProperty', function ($timeout) {
    return {
      restrict: 'E',
      scope: {
        value: '=value',
        isReset: '=isreset',
        'updateChanges': '&onClick'
      },
      templateUrl: 'templates/editProperty.html',
      link: function (scope, elem, attrs) {
        scope.isEdit = false;
        scope.inputEdit = elem.find("input")[0];
        scope.editEnable = function () {
          scope.isEdit = true;
          scope.isReset = false;
          $timeout(function () {
            scope.inputEdit.focus();
          });          
        }
        scope.blurEdit = function (event) {
          if (!scope.form.inputValue.$error.required) {
            scope.isEdit = false;
            scope.updateChanges();
          }
        };
      }
    };
  });

})(window.angular);
