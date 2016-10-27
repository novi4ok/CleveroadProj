// Main application module - setting of the routing in config, defining of the controllers, services and filters
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

  // goodsListController
  appMain.controller('goodsListController', [
      '$scope', '$location', '$compile', 'userProfile', 'goodsList', goodsListController]);

  // goodsList factory
  appMain.factory('goodsList', ['userProfile', 'utils', goodsListFactory]);

  // editItemController
  appMain.controller('editItemController', [
  '$scope', '$routeParams', '$filter', 'goodsList', editItemController]);

  // editProfileController
  appMain.controller('editProfileController', [
  '$scope', 'userProfile', editProfileController]);

  // numericOnly directive
  appMain.directive('numericOnly', numericOnlyDirective);

  // priceFilter
  appMain.filter('priceFilter', priceFilter);

})(window.angular);
