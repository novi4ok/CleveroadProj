(function (angular) {
  'use strict';
  var appMain = angular.module('appMain', ['ngRoute', 'loginModule', 'userProfileModule', 'ui.bootstrap']);
  
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
      .when("/create", {
        templateUrl: "templates/editItem.html",
        controller: "editItemController"
      })
      .when("/edit/:itemId", {
        templateUrl: "templates/editItem.html",
        controller: "editItemController"
      })
      .when("/editProfile", {
        templateUrl: "templates/editProfile.html",
        controller: "editProfileController"
      })
      .when('/404', {
        templateUrl: 'templates/404.html'
      })
      .otherwise({
        redirectTo: '/404'
      });
    
  }]);
  
  // appController
  appMain.controller('appController', [
    '$scope', '$window', 'userProfile', function ($scope, $window, userProfile) {
      userProfile.pingSession();
    }
  ]);

  appMain.controller('goodsListController', [
      '$scope', '$window', '$location', '$compile', 'userProfile', 'goodsList', goodsListController]);

  appMain.factory('goodsList', ['userProfile', 'utils', goodsListFactory]);

  appMain.controller('editItemController', [
  '$scope', '$routeParams', 'goodsList', '$location', editItemController]);

  appMain.controller('editProfileController', [
  '$scope', 'userProfile', editProfileController]);

  appMain.directive('numericOnly', numericOnlyDirective);

  appMain.filter('priceFilter', priceFilter);

})(window.angular);
