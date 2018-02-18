angular.module('yatodo')
.controller("AddTodoCtrl",["$scope","todoService",function($scope,todoService){
    
    $scope.addNewTodo = function(newtodo){
        if(!newtodo) return;
        todoService.addNewTodo(newtodo)
        .then(function(){
            console.log("New todo added successfully");
            $scope.newtodo = "";
        })
    }
}])