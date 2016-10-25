
function goodsListController($scope, $window, $location, userProfile, goodsList) {

  userProfile.pingSession();

  $scope.title = "List of goods";

  $scope.goodsList = goodsList.getList();
  $scope.filterCountList = [10, 20, 50];
  $scope.filterCount = $scope.filterCountList[0];

  $scope.filteredGoodsList = []
  , $scope.currentPage = 1
  , $scope.maxSize = 5;

  var updateList = function () {
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
      trParentElem.after("<tr class='trDetailsArea'><td colspan='5'>" + goods.description + "</td></tr>");
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

function goodsListFactory () {
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

    addItem: function (goods) {
      goodsList.push(goods);
    }
  };
  goodsListObj.constructor();
  return goodsListObj;
}
