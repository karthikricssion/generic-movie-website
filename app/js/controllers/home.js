angular.module('movieApp.HomeController', [])
  
.controller('HomeController', ["$scope", "homeServices" , function($scope, homeServices) {
    $scope.data = {}
    $scope.data.movieObj = {}
    $scope.data.yearObj = {}
    $scope.data.yearArry = []

    $scope.view = {}
    $scope.view.load = false

    $scope.onLoad = function() {
        homeServices.getHomeMoviesList().then(function(res){
            $scope.data.movies = res.data
            $scope.prepare($scope.data.movies)
        }, function(error) {
            console.log("admin controller", error)
        })
    } 

    $scope.prepare = function(movies) {
        for(var i=0; i < movies.length; i++) {
            $scope.data.movieObj[movies[i].movie_db_id] = movies[i]

            if($scope.data.yearArry.indexOf(movies[i].released_year) == -1) {
                $scope.data.yearArry.push(movies[i].released_year)
            }
            
            $scope.data.yearObj[movies[i].released_year] = []
        }

        for (var property in $scope.data.yearObj) {
            if ($scope.data.yearObj.hasOwnProperty(property)) {
                for(var i=0; i < movies.length; i++) {
                    if(movies[i].released_year == property) {
                        $scope.data.yearObj[property].push(movies[i])
                    }
                }
            }
        }

        $scope.data.yearArry = $scope.data.yearArry.sort(function(a, b){return b-a});

        $scope.view.load = true
    }


    $scope.onLoad();
    
}])