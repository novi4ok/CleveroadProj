"use strict";

// Controller for the editing of the items
function editItemController($scope, $routeParams, $filter, goodsList) {
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
        if (!goodsItem) {
          $scope.errorMessage = "Item isn't found!";
        } else {
          if (!goodsItem.price)
            goodsItem.price = 0;
          goodsItem.priceStr = $filter('priceFilter')(goodsItem.price);
          $scope.goodsItem = goodsItem;
        }        
      } else {
        $scope.title = "Create item";
        $scope.action = "Create";
        goodsItem = {
          name: "",
          priceStr: '0,00',
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
          price: parseFloat(goodsItem.priceStr),
          description: goodsItem.description
        };
        goodsList.editItem(goods, function (errorMessage) {
          $scope.isOkResult = !errorMessage;
          $scope.actionMessage = (!errorMessage ? "Item is successfully changed!" : errorMessage);
          if (!errorMessage) {
          }
        });
      } else {
        goodsList.createItem({ name: goodsItem.name, price: parseFloat(goodsItem.priceStr), description: goodsItem.description }, function (errorMessage) {
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
    value = value.toString();
    var valFloat = (value.indexOf(",") >= 0 ? parseFloat(value.replace(',', '.')) : parseFloat(value));
    return valFloat.toFixed(2).toString().replace('.', ',');
  };
}