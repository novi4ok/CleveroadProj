describe('taskModule:', function () {

  beforeEach(module('taskModule'));

  var taskCollection;

  beforeEach(inject(function (_taskCollection_) {
    taskCollection = _taskCollection_;
  }));

  describe('"taskCollection" service:', function () {
    
    it('getActiveTasks:', function () {
      taskCollection.allTasks = [];
      var activeTasks = taskCollection.getActiveTasks();
      expect(activeTasks.length).toBe(0); 

      taskCollection.allTasks = [{obj_status: 'active'}, {}];
      activeTasks = taskCollection.getActiveTasks();
      expect(activeTasks.length).toBe(1);

      taskCollection.allTasks = [{ obj_status: 'passive' }];
      activeTasks = taskCollection.getActiveTasks();
      expect(activeTasks.length).toBe(0);
    });

    it('getTaskById:', function () {
      taskCollection.allTasks = [];
      var task = taskCollection.getTaskById(1);
      expect(task).toBeNull();

      taskCollection.allTasks = [{ id: 1 }, { id: 2 }];
      task = taskCollection.getTaskById(2);
      expect(task.id).toEqual(2);

      taskCollection.allTasks = [{ id: 1 }, { id: 2 }];
      task = taskCollection.getTaskById(3);
      expect(task).toBeNull();
    });

  });

});