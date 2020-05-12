angular.module('movieApp.MoviePageController', [])
  
.controller('MoviePageController', ["$scope", "$stateParams", "$state", "MoviePageServices",
    function($scope, $stateParams, $state, MoviePageServices) {
    $scope.data = {}
    $scope.view = {}

    $scope.view.loaded = false
    $scope.data.movieId = $stateParams.id

    $scope.onLoad = function() {
        MoviePageServices.getHomeMovieDetail($scope.data.movieId).then(function(data){
            $scope.view.loaded = true
            $scope.data.movieDetails = data.data
            console.log($scope.data.movieDetails)
        }, function(error) {
            console.log("admin controller", error)
        })
    }

    $scope.onLoad()

}])