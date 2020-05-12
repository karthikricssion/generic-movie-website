angular.module('movieApp.adminController', [])
  
.controller('adminController', ["$scope", "adminServices" , function($scope, adminServices) {
    $scope.data = {}
    $scope.view = {}
    $scope.filter = {}

    $scope.view.filter = false
    $scope.view.load = true;
    $scope.view.openMoviePopUp = false
    // $scope.view.showHome = true

    $scope.data.homePageId = null
    $scope.data.addedMovieYearCount = {}
    $scope.data.addHomeContentFlag = {}
    $scope.data.addHomeContent = []

    $scope.onLoad = function(){
        adminServices.getMoviesList().then(function(results) {
            $scope.view.load = false;
            $scope.data.movies = results.data;
            if($scope.view.showHome) {
                $scope.loadHomePage()
            }
        }, function(error) {
            console.log("admin controller", error)
        })

        $scope.toggleAllBtn()        
    }

    // $scope.filter = function(data){
    //     if(data) {
    //        $scope.data.filter = null
    //     } 
    // }

    $scope.getMovieDetails = function(id) {
        if(id != undefined) {
            adminServices.getMovieDetails(id).then(function(results) {
                $scope.view.openMoviePopUp = true
                $scope.data.movieDetail = results.data;
            }, function(error) {
                console.log("admin controller", error)
            })
        } else {
            $scope.view.openMoviePopUp = true
            $scope.data.movieDetail = null
        }
        
    }

    $scope.loadHomePage = function() {
        var dataKeys = []
        $scope.data.addHomeContent = []
        $scope.data.addedMovieYearCount = {}
        adminServices.getHomePageMovie().then(function(results) {
            $scope.view.load = false;
            if(results.data[0].dataKeys != '' || results.data[0].dataKeys != null) {
                $scope.data.homePageId = results.data[0]._id
                dataKeys = results.data[0].dataKeys.split(",");       
                for(var i=0; i < $scope.data.movies.length; i++) {
                    for(var j=0; j < dataKeys.length; j++) {
                        if($scope.data.movies[i]._id == dataKeys[j]) {
                            $scope.addToSelectedMovie($scope.data.movies[i])
                        }
                    }
                }
            }                    
        }, function(error) {
            console.log("admin controller", error)
        })
    }

    $scope.onCustomizeHome = function(){
        $scope.view.showHome = !$scope.view.showHome
        if($scope.view.showHome) {
            $scope.loadHomePage();
        } else {
            $scope.saveSelectedHome($scope.data.addHomeContent)
        }
    }

    $scope.addToSelectedMovie = function(movie) {
        $scope.data.addHomeContentFlag[movie._id] = true

        if(isNaN($scope.data.addedMovieYearCount[movie.released_year])) {            
            $scope.data.addedMovieYearCount[movie.released_year] = 1
        } else {
            $scope.data.addedMovieYearCount[movie.released_year] = $scope.data.addedMovieYearCount[movie.released_year] + 1
        }
        
        $scope.data.addHomeContent.push(movie)
        $scope.toggleAllBtn()
    }

    $scope.removeFromSelectedMovie = function(index, movie){
        delete  $scope.data.addHomeContentFlag[movie._id];
        for(var i=0; i < $scope.data.addHomeContent.length; i++) {
            if($scope.data.addHomeContent[i].movie_db_id == movie.movie_db_id) {
                $scope.data.addHomeContent.splice(i, 1)
            }
        }

        if($scope.data.addedMovieYearCount[movie.released_year]) {
            $scope.data.addedMovieYearCount[movie.released_year] = $scope.data.addedMovieYearCount[movie.released_year] - 1
        }

        if($scope.data.addedMovieYearCount[movie.released_year] == 0) {
            delete $scope.data.addedMovieYearCount[movie.released_year]
            $scope.selectedFilterByYearAll();
        }

        $scope.toggleAllBtn()
    }

    $scope.toggleAllBtn = function() {
        if(jQuery.isEmptyObject($scope.data.addedMovieYearCount)) {
            $scope.view.filter = false
        } else {
            $scope.view.filter = true
        }
    }

    $scope.selectedFilterByYear = function(year){
        $scope.filter.released_year = year
    }

    $scope.selectedFilterByYearAll = function() {
        $scope.filter = {}
    }

    $scope.saveSelectedHome = function(keys) {
        var onlykeys = []
        for(var i=0; i < keys.length; i++) {
            onlykeys.push(keys[i]._id)
        }

        var data = {
            _id: $scope.data.homePageId,
            dataKeys: onlykeys.toString()
        }

        adminServices.saveHomePageMovie(data).then(function(res) {
            $scope.view.load = false;
            console.log(res)
        }, function(error) {
            console.log("admin controller", error)
        })
    }

    $scope.onLoad()
}])