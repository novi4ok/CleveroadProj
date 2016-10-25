function editItemController($scope, $routeParams, goodsList, $location) {
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
  };

}

function priceFilter() {
  return function (value) {
    if (!value)
      value = 0;
    return parseFloat(value).toFixed(2).toString().replace('.', ',');
  };
}