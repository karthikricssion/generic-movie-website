angular.module('movieApp.adminServices', [])

.factory('adminServices', [ '$q', '$timeout', '$http', function($q, $timeout, $http) {
    return {
        getMoviesList: function(user) {
            return $http({
                method: 'GET',
                url: 'api/movies/tamil/'
            }).then(function (data){
                return data;
            },function (error){

            });
        },

        getMovieDetails: function(id){
            return $http({
                method: 'GET',
                url: 'api/movies/tamil/'+id
            }).then(function (data){
                return data;
            },function (error){

            });
        },

        getMoviedbData: function(id){
            return $http({
                method: 'GET',
                url: 'api/movies/tamil/moviedb/'+id
            }).then(function (data){
                return data;
            },function (error){

            });
        },

        saveMovie: function(data){
            return $http({
                method: 'POST',
                url: 'api/movies/tamil/moviedb/',
                data: data
            }).then(function (data){
                return data;
            },function (error){

            });
        },

        createMovie: function(data){
            return $http({
                method: 'POST',
                url: 'api/movies/addnew/',
                data: data
            }).then(function (data){
                return data;
            },function (error){

            });
        },

        deleteMovie: function(data){
            return $http({
                method: 'POST',
                url: 'api/movies/tamil/moviedb/delete/',
                data: data
            }).then(function (data){
                return data;
            },function (error){

            });
        },
        
        saveHomePageMovie: function(data){
            return $http({
                method: 'POST',
                url: 'api/movies/homecontent/',
                data: data
            }).then(function (data){
                return data;
            },function (error){

            });
        },

        getHomePageMovie: function() {
            return $http({
                method: 'GET',
                url: 'api/movies/homecontent/'
            }).then(function (data){
                return data;
            },function (error){
                console.log(error);
            });
        },
    }
}])