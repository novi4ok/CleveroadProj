exports.GoodsMgr = function () {
  var _ = require('underscore');

  var currentRequest;

  var goodsList = [];

  var goodsMgrObj = {

    constructor: function () {
      this.populateList();
    },

    setRequest: function (request) {
      currentRequest = request;
    },

    populateList: function() {
      goodsList = [];
      var startPrice = 1000.01;
      for (var i = 0; i < 1000; i++) {
        goodsList.push(
        {
          id: i,
          name: 'name' + i,
          price: startPrice + i,
          description: 'description' + i
        });
        startPrice += 0.01;
      }
    },

    getGoodsList: function (objResponse, callback) {

      objResponse.data = goodsList;

      if (callback)
        callback();
    },

    createItem: function (data, objResponse, callback) {
      if (!data || !data.goods) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      data.goods.id = goodsList.length;
      goodsList.push(data.goods);

      objResponse.data = data.goods;
      if (callback)
        callback();
    },

    editItem: function (data, objResponse, callback) {
      if (!data || !data.goods || (typeof data.goods.id == 'undefined') || !data.goods.name || (typeof data.goods.price == 'undefined') || !data.goods.description) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }
      
      var goodsFound = _.findWhere(goodsList, { id: data.goods.id });
      if (goodsFound) {
        var goods = data.goods;
        goodsFound.name = goods.name;
        goodsFound.price = goods.price;
        goodsFound.description = goods.description;
        objResponse.data = goodsFound;
      } else {
        objResponse.error = "Goods isn't found!";
      }
      if (callback)
        callback();
    },

    deleteItems: function (data, objResponse, callback) {
      if (!data || !data.goodsItems) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      objResponse.data = [];
      var goodsRemoved = [];
      data.goodsItems.forEach(function (item) {
        var goodsFound = _.findWhere(goodsList, { id: item.id });
        if (goodsFound) {
          goodsList = _.without(goodsList, goodsFound);
          goodsRemoved.push(item);
        } else {
          objResponse.error += "Goods id=" + item.id + " isn't found!";
        }

      });
      objResponse.data = goodsRemoved;
      if (callback)
        callback();
    },

  };

  goodsMgrObj.constructor();
  return goodsMgrObj;
};
