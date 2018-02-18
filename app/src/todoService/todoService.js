angular.module('yatodo')
.service("todoService",["$q","$http","$rootScope",function($q,$http,$rootScope){
    var todoService = this;

    var mockedTodoList = [
        {id:1,todoText:"todo text 1 ",isDone:true},
        {id:2,todoText:"todo text 2 ",isDone:false},
        {id:3,todoText:"todo text 3 ",isDone:false},
        {id:4,todoText:"todo text 4 ",isDone:true},
        {id:5,todoText:"todo text 5 ",isDone:false},
        {id:6,todoText:"todo text 6 ",isDone:true}
    ]
    todoService.getTodos = function(){
        var defer = $q.defer();
        $http.get("http://localhost:3333/api/todos")
        .then(function(res){
            defer.resolve(res.data); 
        })
        return defer.promise;
    }
    todoService.addNewTodo = function(todoText){
        var defer = $q.defer();
        $http.post("http://localhost:3333/api/todo",{todoText:todoText,isDone:false})
        .then(function(){
            defer.resolve(mockedTodoList);

            $rootScope.$broadcast('todoListUpdated',{});
        })
        return defer.promise;
    }
    todoService.toggleToodState = function(todo){
        var defer = $q.defer();
        $http.patch("http://localhost:3333/api/todo",{id:todo._id,isDone:todo.isDone})
        .then(function(){
            $rootScope.$broadcast('todoListUpdated',{});
        })
        return defer.promise;
    }
    todoService.deleteTodo = function(todo){
        var defer = $q.defer();
        $http.delete("http://localhost:3333/api/todo/"+todo._id)
        .then(function(){
            $rootScope.$broadcast('todoListUpdated',{});
        })
        return defer.promise;
    }
    return todoService;
}])