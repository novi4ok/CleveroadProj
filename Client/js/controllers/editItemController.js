function editItemController($scope, $routeParams, goodsList, $location) {

  $scope.isNoValid = false;
  $scope.isOkResult = false;
  $scope.actionMessage = "";
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

  $scope.saveItem = function (form) {
    $scope.isNoValid = !form.$valid;
    if (!form.$valid)
      return;

    if ($scope.goodsItem) {
      var goods = {
        id: $scope.goodsItem.id,
        name: $scope.name,
        price: $scope.price,
        description: $scope.description
      };
      goodsList.editItem(goods, function (resGoods, errorMessage) {
        $scope.isOkResult = !errorMessage;
        $scope.actionMessage = (!errorMessage ? "Item is successfully changed!" : errorMessage);
        if (!errorMessage && resGoods) {
          $scope.goodsItem.name = resGoods.name;
          $scope.goodsItem.price = resGoods.price;
          $scope.goodsItem.description = resGoods.description;
        }
      });
    } else {
      goodsList.createItem({ name: $scope.name, price: $scope.price, description: $scope.description }, function (errorMessage) {
        $scope.isOkResult = !errorMessage;
        $scope.actionMessage = (!errorMessage ? "Item is successfully created!" : errorMessage);
        if (!errorMessage) {
          $scope.name = "";
          $scope.price = 0;
          $scope.description = "";
        }        
      });
    }
  };

}

function priceFilter() {
  return function (value) {
    if (!value)
      value = 0;
    return parseFloat(value).toFixed(2).toString().replace('.', ',');
  };
}