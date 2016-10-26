﻿
function goodsListController($scope, $window, $location, $compile, userProfile, goodsList) {

  //var goodsListCtrl = {
  //  constructor: function () {

  //  },

  //};

  
  userProfile.pingSession();

  $scope.title = "List of goods";

  

  var updateList = function () {
    var filterCount = parseInt($scope.filterCount);
    var begin = (($scope.currentPage - 1) * filterCount)
    , end = begin + filterCount;

    $scope.filteredGoodsList = $scope.goodsList.slice(begin, end);
    $scope.isCheckAll = false;
  };

  goodsList.getList(function(goodsList, errorMessage) {
    $scope.goodsList = goodsList;
    updateList();
  });
  $scope.filterCountList = [10, 20, 50];
  $scope.filterCount = $scope.filterCountList[0];

  $scope.filteredGoodsList = []
  , $scope.currentPage = 1
  , $scope.maxSize = 5;

  $scope.$watch('currentPage + filterCount', function () {
    updateList();
  });

  $scope.lastDetailsGoods = null;
  $scope.detailsClick = function (event, goods) {
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

      var contentFn = $compile("<tr class='trDetailsArea'><td colspan='5'>{{lastDetailsGoods.description}}</td></tr>");
      var contentElems = contentFn($scope);
      trParentElem.after(contentElems);

      //trParentElem.after("<tr class='trDetailsArea'><td colspan='5'>" + goods.description + "</td></tr>");
    }
  };

  $scope.isCheckAll = false;
  $scope.checkAll = function (event) {
    angular.forEach($scope.filteredGoodsList, function (goods) {
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
    angular.forEach(checkedItems, function (item) {
      var index = $scope.goodsList.indexOf(item);
      $scope.goodsList.splice(index, 1);
    });
    updateList();
  };

  $scope.createNew = function () {
    $location.path("/create");
  };
}

function goodsListFactory(userProfile, utils) {
  var goodsList = [];
  var goodsListObj = {

    constructor: function () {
    },

    getList: function (callback) {
      var action = "getGoodsList";
      var data = {
        action: action,
      };

      var session = userProfile.getSession();
      data.sessionID = (session ? session.id : '');

      utils.httpRequest(data, function success(response) {
        var errorMessage = "";
        if (!response.error) {
          if (response.data) {
            goodsList = response.data;
          }
        } else {
          if (!response.error || response.error === "")
            errorMessage = "UNKNOWN ERROR";
          else
            errorMessage = response.error;
        }
        if (callback)
          callback(goodsList, errorMessage);
      }, function error(response, status, headers) {
        var errorMessage = (response ? "Error: " + response : "");
        if (!errorMessage) {
          errorMessage += "Error: status=" + status;
        }
        if (callback)
          callback(errorMessage);
      });
    },

    getGoodsById: function (id) {
      if (!id) return null;

      id = parseInt(id);
      if (isNaN(id)) return null;

      var itemFound = null;
      for (var i = 0; i < goodsList.length; i++) {
        if (goodsList[i].id === id) {
          itemFound = goodsList[i];
          break;
        }
      }
      return itemFound;
    },

    createItem: function (goods, callback) {
      var action = "createItem";
      var data = {
        action: action,
        goods: goods
      };

      var session = userProfile.getSession();
      data.sessionID = (session ? session.id : '');

      utils.httpRequest(data, function success(response) {
        var errorMessage = "";
        if (!response.error) {
          if (response.data) {
            goodsList.push(response.data);
          }
        } else {
          if (!response.error || response.error === "")
            errorMessage = "UNKNOWN ERROR";
          else
            errorMessage = response.error;
        }
        if (callback)
          callback(errorMessage);
      }, function error(response, status, headers) {
        var errorMessage = (response ? "Error: " + response : "");
        if (!errorMessage) {
          errorMessage += "Error: status=" + status;
        }
        if (callback)
          callback(errorMessage);
      });

    },

    editItem: function (goods, callback) {
      var action = "editItem";
    var data = {
      action: action,
      goods: goods
    };

    var session = userProfile.getSession();
    data.sessionID = (session ? session.id : '');

    utils.httpRequest(data, function success(response) {
      var errorMessage = "";
      if (!response.error) {
        
      } else {
        if (!response.error || response.error === "")
          errorMessage = "UNKNOWN ERROR";
        else
          errorMessage = response.error;
      }
      if (callback)
        callback(response.data, errorMessage);
    }, function error(response, status, headers) {
      var errorMessage = (response ? "Error: " + response : "");
      if (!errorMessage) {
        errorMessage += "Error: status=" + status;
      }
      if (callback)
        callback(errorMessage);
    });

  }
  };
  goodsListObj.constructor();
  return goodsListObj;
} 
