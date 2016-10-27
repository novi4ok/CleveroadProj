// Controller for working with the list of goods
function goodsListController($scope, $location, $compile, userProfile, goodsList) {

  var self;
  var templateDetails = "<tr class='trDetailsArea'><td colspan='5'><strong>Description: </strong>{{lastDetailsGoods.description}}</td></tr>";

  var goodsListCtrl = {
    constructor: function () {
      self = this;
      userProfile.pingSession();

      goodsList.getList(function (goodsList, errorMessage) {
        $scope.goodsList = goodsList;
        self.updateList();
      });

      $scope.title = "List of goods";
      $scope.filteredGoodsList = [];
      $scope.filterCountList = [10, 20, 50];
      $scope.filterCount = $scope.filterCountList[0];
      $scope.currentPage = 1;
      $scope.maxSize = 5;

      $scope.$watch('currentPage + filterCount', function () {
        self.updateList();
      });

      $scope.lastDetailsGoods = null;
      $scope.detailsClick = self.detailsClick;

      $scope.isCheckAll = false;
      $scope.isItemChecked = false;
      $scope.checkAll = self.checkAll;
      $scope.updateCheckItem = self.updateCheckItem;

      $scope.deleteSelected = self.deleteSelected;
      $scope.createNew = self.createNew;
    },

    updateList: function () {
      var filterCount = parseInt($scope.filterCount);
      var begin = (($scope.currentPage - 1) * filterCount), end = begin + filterCount;

      $scope.filteredGoodsList = $scope.goodsList.slice(begin, end);
      $scope.isCheckAll = false;

      self.updateCheckItem();
    },

    detailsClick: function (event, goods) {
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

        var tmplDetails = $compile(templateDetails);
        var contentDetails = tmplDetails($scope);
        trParentElem.after(contentDetails);
      }
    },

    checkAll: function (event) {
      angular.forEach($scope.filteredGoodsList, function (goods) {
        goods.checked = $scope.isCheckAll;
      });
    },

    updateCheckItem: function() {
      var isItemChecked = false;
      for (var i = 0; i < $scope.filteredGoodsList.length; i++) {
        if ($scope.filteredGoodsList[i].checked) {
          isItemChecked = true;
          break;
        }
      }
      $scope.isItemChecked = isItemChecked;
    },

    deleteSelected: function () {
      var checkedItems = [];
      angular.forEach($scope.filteredGoodsList, function (goods) {
        if (goods.checked) {
          checkedItems.push(goods);
        }
      });

      goodsList.deleteItems(checkedItems, function (errorMessage) {
        $scope.isOkResult = !errorMessage;
        $scope.actionMessage = (!errorMessage ? "Items are successfully deleted!" : errorMessage);
        self.updateList();
      });

      
    },

    createNew: function () {
      $location.path("/create");
    }

  };
  goodsListCtrl.constructor();
  return goodsListCtrl;
}

// service for getting/changing of the goods list 
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
          errorMessage = response.error;
        }
        if (callback)
          callback(goodsList, errorMessage);
      }, function error(response, status, headers) {
        var errorMessage = (response ? "Error: " + response : "Error: status=" + status);
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
          errorMessage = response.error;
        }
        if (callback)
          callback(errorMessage);
      }, function error(response, status, headers) {
        var errorMessage = (response ? "Error: " + response : "Error: status=" + status);
        if (callback)
          callback(errorMessage);
      });
    },

    deleteItems: function (goodsItems, callback) {
      var action = "deleteItems";
      var data = {
        action: action,
        goodsItems: goodsItems
      };

      var session = userProfile.getSession();
      data.sessionID = (session ? session.id : '');

      utils.httpRequest(data, function success(response) {
        var errorMessage = "";
        if (!response.error) {
          if (response.data) {
            response.data.forEach(function (item) {
              var index = -1;
              for (var i = 0; i < goodsList.length; i++) {
                if (item.id === goodsList[i].id) {
                  index = i;
                  break;
                }
              }
              goodsList.splice(index, 1);
            });
          }
        } else {
          errorMessage = response.error;
        }
        if (callback)
          callback(errorMessage);
      }, function error(response, status, headers) {
        var errorMessage = (response ? "Error: " + response : "Error: status=" + status);
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
          errorMessage = response.error;
        }
        if (callback)
          callback(errorMessage);
      }, function error(response, status, headers) {
        var errorMessage = (response ? "Error: " + response : "Error: status=" + status);
        if (callback)
          callback(errorMessage);
      });

    }
  };
  goodsListObj.constructor();
  return goodsListObj;
} 
