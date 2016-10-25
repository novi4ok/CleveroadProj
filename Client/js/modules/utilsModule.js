(function (angular) {
  'use strict';
  angular.module('utilsModule', [])
  .factory('Utils', ['$http', '$rootScope', '$location', function ($http, $rootScope, $location) {

    var urlServer = "http://localhost:80/";

    var utilsObj = {

      constructor: function() {
        $rootScope.backToList = this.backToList;
      },

      httpRequest: function (data, success, error) {
        if (!data || !success)
          return;

        var url = urlServer;

        var req = {
          method: 'POST',
          url: url,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': "application/json, text/plain, */*",
          },
          data: JSON.stringify(data)
        };

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

      backToList: function() {
        $location.path('/');
      },
      
    };
    utilsObj.constructor();
    return utilsObj;
  }]);

})(window.angular);
