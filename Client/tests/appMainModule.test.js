describe('appMainModule:', function () {

  var $route, $filter, $controller, loginModule, userProfileModule;

  beforeEach(function () {
    angular.module('loginModule');
    angular.module('userProfileModule');
    //module('ui.bootstrap');
    
    module('ngRoute');
    
    module('appMain');
  });

  beforeEach(inject(function (_$controller_, _$route_, _$filter_) {
    $controller = _$controller_;
    $route = _$route_; 
    $filter = _$filter_;
  }));

  describe('priceFilter:', function () {

    it('Formatting value', function () {
      var priceFilter = $filter('priceFilter');

      var value = priceFilter("100");
      expect(value).toEqual("100,00");

      value = priceFilter("100.00");
      expect(value).toEqual("100,00");

      value = priceFilter("");
      expect(value).toEqual("0,00");

      value = priceFilter("test");
      expect(value).toEqual("NaN");
    });
    
  });

  
});
