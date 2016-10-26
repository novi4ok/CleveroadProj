// Controller for the editing of the items
function editItemController($scope, $routeParams, goodsList) {
  var self;
  var isEditAction = false;
  var goodsItem;

  var editItemCtrl = {
    constructor: function () {
      self = this;

      $scope.isNoValid = false;
      $scope.isOkResult = false;
      $scope.actionMessage = "";
      if ($routeParams.itemId) {
        isEditAction = true;
        $scope.title = "Edit item";
        $scope.action = "Save";
        goodsItem = goodsList.getGoodsById($routeParams.itemId);
        if (!$scope.goodsItem) {
          $scope.errorMessage = "Item isn't found!";
        } else {
          $scope.goodsItem = {};
        }
        $scope.goodsItem = goodsItem;
      } else {
        $scope.title = "Create item";
        $scope.action = "Create";
        goodsItem = {
          name: "",
          price: 0,
          description: ""
        };
        $scope.goodsItem = goodsItem;
      }

      $scope.saveItem = self.saveItem;
    },

    saveItem: function (form) {
      $scope.isNoValid = !form.$valid;
      if (!form.$valid)
        return;

      if (isEditAction) {
        var goods = {
          id: goodsItem.id,
          name: goodsItem.name,
          price: goodsItem.price,
          description: goodsItem.description
        };
        goodsList.editItem(goods, function (resGoods, errorMessage) {
          $scope.isOkResult = !errorMessage;
          $scope.actionMessage = (!errorMessage ? "Item is successfully changed!" : errorMessage);
          if (!errorMessage && resGoods) {
            goodsItem.name = resGoods.name;
            goodsItem.price = resGoods.price;
            goodsItem.description = resGoods.description;
          }
        });
      } else {
        goodsList.createItem({ name: goodsItem.name, price: goodsItem.price, description: goodsItem.description }, function (errorMessage) {
          $scope.isOkResult = !errorMessage;
          $scope.actionMessage = (!errorMessage ? "Item is successfully created!" : errorMessage);
          if (!errorMessage) {
            $scope.name = "";
            $scope.price = 0;
            $scope.description = "";
          }        
        });
      }
    }

  };

  editItemCtrl.constructor();
  return editItemCtrl;
}

// Price filter - change the symbol "." on "," 
function priceFilter() {
  return function (value) {
    if (!value)
      value = 0;
    return parseFloat(value).toFixed(2).toString().replace('.', ',');
  };
}