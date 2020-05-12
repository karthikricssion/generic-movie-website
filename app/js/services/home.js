angular.module('movieApp.homeServices', [])

.factory('homeServices', [ '$q', '$timeout', '$http', function($q, $timeout, $http) {
    return {
        getHomeMoviesList: function(user) {
            return $http({
                method: 'GET',
                url: 'api/movies/tamil/home/list/'
            }).then(function (data){
                return data;
            },function (error){

            });
        }
    }
}])