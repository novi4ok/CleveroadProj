describe('appMainModule:', function () {

  var $route, $filter, $controller, taskCollection, utils;

  beforeEach(function () {
    angular.module('taskModule');
    angular.module('utilsModule');
    
    module('ngRoute');
    
    module('appMain');
  });

  beforeEach(module('templates'));

  beforeEach(inject(
    function (_$route_, _$filter_) {
      $route = _$route_;
      $filter = _$filter_;
    }));
  

  it('"timeValue" filter:', function () {
    var timeValue = $filter('timeValue');

    var res = timeValue(1);
    expect(res).toEqual("1 hours");

    res = timeValue(1.5);
    expect(res).toEqual("1 hours 30 minutes");

    res = timeValue(0);
    expect(res).toEqual("0 hours");

    res = timeValue();
    expect(res).toEqual("");
  });

  describe('Controllers:', function() {
    beforeEach(inject(
      function (_$controller_, _taskCollection_, _Utils_) {
        $controller = _$controller_;
        taskCollection = _taskCollection_
        utils = _Utils_;
      }));

    describe('appController:', function () {
      it('Init:', function () {
        var $scope = {};
        taskCollection.allTasks = [];
        var controller = $controller('appController', {
          $scope: $scope,
          taskCollection: taskCollection,
          utils: utils
        });
        expect($scope.tasksList.length).toEqual(0);
        expect($scope.tasksList).toEqual(taskCollection.getActiveTasks());
        expect($scope.rowClick).toEqual(utils.selectRow);
      });
    });

    describe('taskDescriptionController:', function () {

      function createController($scope) {
        taskCollection.allTasks = [{ id: 1 }, { id: 2 }];
        return $controller('taskDescriptionController', {
          $scope: $scope,
          $routeParams : {taskId: 2},
          taskCollection: taskCollection,
          utils: utils
        });        
      };

      it('Init:', function () {
        var $scope = {};
        var controller = createController($scope);
        expect($scope.taskCopy.id).toEqual(2);
        expect($scope.task.id).toEqual($scope.taskCopy.id);
        expect($scope.isDataChanged).toBe(false);
        expect($scope.isResetChanges).toBe(false);
        expect($scope.errorMessage).toEqual("");
      });

      it('updateChanges:', function () {
        var $scope = {};
        var controller = createController($scope);
        $scope.task.id = 1;
        $scope.taskCopy.id = 2;
        $scope.updateChanges();
        expect($scope.isDataChanged).toBe(true);

        $scope.taskCopy.id = 1;
        $scope.updateChanges();
        expect($scope.isDataChanged).toBe(false);
      });

      it('resetChanges:', function () {
        var $scope = {};
        var controller = createController($scope);
        $scope.task.id = 1;
        $scope.taskCopy.id = 2;
        $scope.isResetChanges = false;
        $scope.resetChanges();
        expect($scope.isResetChanges).toBe(true);
        expect($scope.task.id).toEqual($scope.taskCopy.id);
      });

      describe('editProperty:', function () {
        var $compile, $rootScope, scope, directiveElem;


        function getCompiledElement() {
          var compiledDirective = $compile(angular.element('<edit-property on-click="updateChanges()" value="valueTest" isreset="isResetChanges"></edit-property>'))(scope);
          scope.$digest();
          return compiledDirective;
        }

        beforeEach(inject(function (_$compile_, _$rootScope_) {
          $compile = _$compile_;
          $rootScope = _$rootScope_;
          scope = $rootScope.$new();
        }));

        it('Rendering:', function () {
          scope.valueTest = 'test';
          scope.isResetChanges = false;
          scope.onClick = jasmine.createSpy('onClick');

          directiveElem = getCompiledElement();

          var html = directiveElem.html();
          expect(html).toContain('dvEditProperty');

          var dvView = directiveElem[0].querySelector('.dvView');
          var spanElem = angular.element(dvView.querySelector('span'));

          expect(spanElem.text()).toEqual('test');
        });
      });
    });
    
  });
  

});