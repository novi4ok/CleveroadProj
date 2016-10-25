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
      userProfile.pingSession();
    }
  ]);

  // appController
  appMain.controller('goodsListController', [
    '$scope', '$window', '$location', 'userProfile', 'goodsList', function ($scope, $window, $location, userProfile, goodsList) {
      userProfile.pingSession();

      $scope.title = "List of goods";

      $scope.goodsList = goodsList.getList();
      $scope.filterCountList = [10, 20, 50];
      $scope.filterCount = $scope.filterCountList[0];

      $scope.filteredGoodsList = []
     , $scope.currentPage = 1
     , $scope.maxSize = 5;

      var updateList = function() {
        var filterCount = parseInt($scope.filterCount);
        var begin = (($scope.currentPage - 1) * filterCount)
        , end = begin + filterCount;

        $scope.filteredGoodsList = $scope.goodsList.slice(begin, end);
        $scope.isCheckAll = false;
      };

      $scope.$watch('currentPage + filterCount', function () {
        updateList();
      });

      $scope.lastDetailsGoods = null;
      $scope.detailsClick = function(event, goods) {
        goods.isShowDetails = ($scope.lastDetailsGoods !== goods) || !goods.isShowDetails;
        $scope.lastDetailsGoods = goods;

        var detailsElem = angular.element(event.currentTarget);
        var trParentElem = detailsElem.parent().parent();
        var tableParentElem = trParentElem.parent();
        angular.element(tableParentElem[0].querySelectorAll(".trDetailsArea")).remove();
        angular.element(tableParentElem[0].querySelectorAll(".tdDetailsOpen")).text("Details");
        if (goods.isShowDetails) {
          detailsElem.text("Hide");
          detailsElem.addClass("tdDetailsOpen");
          trParentElem.after("<tr class='trDetailsArea'><td colspan='5'>" + goods.description + "</td></tr>");
        }
      };

      $scope.isCheckAll = false;
      $scope.checkAll = function(event) {
        angular.forEach($scope.filteredGoodsList, function(goods) {
          goods.checked = $scope.isCheckAll;
        });
      };

      $scope.deleteSelected = function () {
        var checkedItems = [];
        angular.forEach($scope.filteredGoodsList, function (goods) {
          if (goods.checked) {
            checkedItems.push(goods);
          }
        });
        angular.forEach(checkedItems, function(item) {
          var index = $scope.goodsList.indexOf(item);
          $scope.goodsList.splice(index, 1);
        });
        updateList();
      };

      $scope.createNew = function () {
        $location.path("/create");
      };

    }
  ]);

  appMain.controller('editItemController', [
  '$scope', '$routeParams', 'goodsList', function ($scope, $routeParams, goodsList) {
    //userProfile.pingSession();

    $scope.errorMessage = "";
    if (!$routeParams.itemId) {
      $scope.title = "Create item";
      $scope.action = "Create";
      $scope.name = "";
      $scope.price = 0;
      $scope.description = "";
    } else {
      $scope.title = "Edit item";
      $scope.action = "Save";
      $scope.goodsItem = goodsList.getGoodsById($routeParams.itemId);
      if ($scope.goodsItem) {
        $scope.name = $scope.goodsItem.name;
        $scope.price = $scope.goodsItem.price;
        $scope.description = $scope.goodsItem.description;
      } else {
        $scope.errorMessage = "Items isn't found!";
      }
    }

    $scope.saveItem = function () {
      if ($scope.goodsItem) {
        $scope.goodsItem.name = $scope.name;
        $scope.goodsItem.price = $scope.price;
        $scope.goodsItem.description = $scope.description;
      } else {
        goodsList.addItem({ name: $scope.name, price: $scope.price, description: $scope.description });
      }

      $scope.goBack();
    };

    // goBack
    $scope.goBack = function () {
      window.history.back();
    };

  }]);

  appMain.controller('editProfileController', [
  '$scope', 'userProfile', function ($scope, userProfile) {
    userProfile.pingSession();

    $scope.isNoValid = false;
    $scope.isNoValidPassword = false;
    $scope.isChangePasswordShow = false;
    $scope.actionMessage = "";
    $scope.isOkResult = false;
    $scope.title = "Edit profile";
    $scope.prefix = "+380";

    var sessionUser = userProfile.getSession();
    if (!sessionUser || !sessionUser.user)
      return;

    var user = sessionUser.user;
    $scope.name = user.name;
    $scope.surname = user.surname;
    $scope.email = user.email;
    if (!user.phone)
      user.phone = "";
    $scope.phone = user.phone.replace($scope.prefix, "");

    var editProfileCtnrElem = angular.element(document.querySelector("#editProfileCtnr"));
    editProfileCtnrElem.find("input").bind("keydown", function () {
      $scope.isNoValid = false;
      $scope.isNoValidPassword = false;
    });

    $scope.saveProfile = function (form) {
      $scope.isNoValid = !form.$valid;
      if (!form.$valid)
        return;

      user.name = $scope.name;
      user.surname = $scope.surname;
      user.email = $scope.email;
      if ($scope.phone)
        user.phone = $scope.prefix + $scope.phone;

      userProfile.saveProfile(user, function(errorMessage) {
        if (errorMessage) {
          $scope.actionMessage = errorMessage;
          $scope.isOkResult = false;
        } else {
          $scope.actionMessage = "Data is saved successfully!";
          $scope.isOkResult = true;
        }
      });
    };

    $scope.changePassword = function (form) {
      $scope.isNoValidPassword = !form.$valid;
      if (!form.$valid)
        return;

      user.password = $scope.newPassword;
    };

    // goBack
    $scope.goBack = function () {
      window.history.back();
    };

  }]);

  appMain.directive('numericOnly', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, modelCtrl) {

        modelCtrl.$parsers.push(function (inputValue) {
          var transformedInput = inputValue ? inputValue.replace(/[^\d.-]/g, '') : null;

          if (transformedInput != inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();
          }

          return transformedInput;
        });
      }
    };
  });

  appMain.filter('priceFilter', function () {
    return function (value) {
      if (!value)
        value = 0;
      return parseFloat(value).toFixed(2).toString().replace('.', ',');
    };
  });


  appMain.factory('goodsList', function () {
    var goodsList;
    var goodsListObj = {
      constructor: function () {
        goodsList = [];
        for (var i = 0; i < 1000; i++) {
          goodsList.push(
          {
            id: i,
            name: 'name' + i,
            price: i * 1000.23,
            description: 'description' + i
          });
        }
      },

      getList: function () {
        return goodsList;
      },

      getGoodsById: function (id) {
        if(!id) return null;
        
        id = parseInt(id);
        if(isNaN(id)) return null;
        
        var itemFound = null;
        for (var i = 0; i < goodsList.length; i++) {
          if (goodsList[i].id === id) {
            itemFound = goodsList[i];
            break;
          }
        }
        return itemFound;
      },

      addItem: function (goods) {
        goodsList.push(goods);
      }
    };
    goodsListObj.constructor();
    return goodsListObj;
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
