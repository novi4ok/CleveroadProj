(function (angular) {
  'use strict';
  angular.module('utilsModule', [])
  .factory('Utils', function () {

    var utilsObj = {

      selectRow: function (event) {
        event = event || window.event;
        var selElem = document.querySelector('.selected');
        angular.element(selElem).removeClass('selected');
        angular.element(event.currentTarget).addClass('selected');
      }
    };

    return utilsObj;
  });

})(window.angular);
