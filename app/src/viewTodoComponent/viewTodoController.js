angular.module('yatodo')
    .controller("ViewTodoCtrl", ["$scope", "todoService", "$rootScope", function ($scope, todoService, $rootScope) {
        $scope.todoText = "This is a placeholder";
        $scope.todoList = [];

        $rootScope.$on("todoListUpdated", updateTodoList)

        function updateTodoList() {
            todoService.getTodos()
                .then(function (todoList) {
                    console.log(todoList)
                    $scope.todoList = todoList;
                }, function (err) {
                    console.log(err);
                });
        }
        updateTodoList();

        $scope.toggleTodo = function (todo) {
            todoService.toggleToodState(todo)
                .then(function (todoList) {
                    console.log("toggled");
                });
        }
        $scope.removeTodo = function (todo) {
            todoService.deleteTodo(todo)
                .then(function () {
                    console.log("deleted");
                })
        }
    }])