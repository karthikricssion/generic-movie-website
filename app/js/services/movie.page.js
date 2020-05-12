angular.module('movieApp.MoviePageServices', [])

.factory('MoviePageServices', [ '$q', '$timeout', '$http', function($q, $timeout, $http) {
    return {
        getHomeMovieDetail: function(id) {
            return $http({
                method: 'GET',
                url: 'api/movie/'+id
            }).then(function (data){
                return data;
            },function (error){

            });
        }
    }
}])