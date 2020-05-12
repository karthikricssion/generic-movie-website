const dotenv = require('dotenv');
dotenv.config();
var MovieDetail = require('../schema/movie_detail').movieSchema;
var HomePage = require('../schema/home_page_content').homePageSchema;
var request = require('request');
var async = require("async");
var moviedb_api = process.env.TMDB_API_KEY;

module.exports = function(app){
    app.get('/api/movies/tamil/home/list/', function (req, res) {
        var keys = []
        var temp_movie_urls = []
        HomePage.find({ _id: "58f479b8cb0c1d20991bad06"},  function(err, movieKeys) {
            if(movieKeys[0].dataKeys != '' || movieKeys[0].dataKeys != null ) {
               keys =  movieKeys[0].dataKeys.split(',')
               MovieDetail.find({ _id: {$in: keys}}, 'original_title released_year movie_db_id is_dubbed', function(err, movies) {
                   for(var i=0; i < movies.length;i++) {
                       var url = 'https://api.themoviedb.org/3/movie/'+movies[i].movie_db_id+'?api_key='+moviedb_api
                       temp_movie_urls.push(url)
                   }

                   var response_move = []
                   
                   async.map(temp_movie_urls, function(url, callback) {    
                       request(url, function (error, response, body) {
                           if (!error) {
                                var data = JSON.parse(body);
                                
                                var tmp_url = url
                                tmp_url = tmp_url.split("?")[0].split('https://api.themoviedb.org/3/movie/')
                                tmp_url = tmp_url.filter(String)[0];
                                
                                for(var i=0; i < movies.length;i++) {
                                    if(movies[i].movie_db_id == tmp_url) {
                                        let movie = {}
                                        movie['image'] = "http://image.tmdb.org/t/p//w342"+data.poster_path;
                                        movie['production_companies'] = data.production_companies
                                        movie['movie_db_id'] = movies[i].movie_db_id
                                        movie['original_title'] = movies[i].original_title
                                        movie['released_year'] = parseInt(movies[i].released_year)
                                        response_move.push(movie)
                                    }
                                }
                            } else {
                                console.log("We’ve encountered an error: " + error);
                            }
                            callback(error, body);
                       });
                    }, function done() {
                        res.json(response_move);
                    }, function(err, results) {
                        console.log(err);
                    });
               });  
            }
        });
    })

    app.get('/api/movies/tamil/', function (req, res) {
        MovieDetail.find({},'_id original_title released_year movie_db_id is_dubbed',  function(err, movies) {
            res.json(movies);
        });
    })

    app.get('/api/movies/tamil/:id', function(req, res) {
        var movieId = req.param('id')
        MovieDetail.find({ _id: movieId}).lean().exec(function(err, movies_detail) {
            res.json(movies_detail[0]);          
        });        
    });

    app.get('/api/movies/tamil/moviedb/:moviedb_id', function(req, res) {
        var getmoviedb_id = req.param('moviedb_id')
        var url = 'https://api.themoviedb.org/3/movie/'+getmoviedb_id+'?api_key='+moviedb_api
        
        request(url, function (error, response, body) {
            if (!error) {
                var data = JSON.parse(body);
                res.json({
                    url:"http://image.tmdb.org/t/p/w342"+data.poster_path 
                });
            } else {
                console.log("We’ve encountered an error: " + error);
            }
        });      
    });

    app.post('/api/movies/tamil/moviedb/', function(req, res) {
        MovieDetail.update({ _id: req.body._id }, req.body, { multi: false }, function(err, movies_detail) {
            res.json(movies_detail[0]);          
        });
    });

    app.post('/api/movies/tamil/moviedb/delete/', function(req, res) {
        MovieDetail.remove({ _id: req.body._id },  function(err, movies_detail) {
            res.json(movies_detail[0]);          
        });
    });

    app.post('/api/movies/homecontent/', function(req, res) {
        HomePage.update({ _id: req.body._id }, req.body, { multi: false },function(err) {
            if (err) throw err;
        });
    })

    app.get('/api/movies/homecontent/', function (req, res) {
        HomePage.find({},  function(err, HomePageVal) {
            res.json(HomePageVal);
        });
    })

    app.get('/api/movie/:id', function (req, res) {
        var getmoviedb_id = req.param('id')
        var url = "https://api.themoviedb.org/3/movie/"+getmoviedb_id+"?api_key="+moviedb_api+"&append_to_response=keywords,alternative_titles,credits,images,keywords,releases,reviews,translations,videos"
        
        request(url, function (error, response, body) {
            if (!error) {
                var data = JSON.parse(body);
                MovieDetail.count({movie_db_id: getmoviedb_id}, function (err, count){ 
                    if(count>0){
                       MovieDetail.find({movie_db_id: getmoviedb_id}, 'original_title embed_link', function(err, movies_detail) {
                            data['inner_overview'] = movies_detail[0]
                            res.json(data);          
                        });   
                    } else {
                        res.json(data);
                    }
                }); 

                
            } else {
                console.log("We’ve encountered an error: " + error);
            }
        }); 
    })

    app.post('/api/movies/addnew/', function(req, res) {
        var newMovieDetail = new MovieDetail(req.body);
        newMovieDetail.save(function (err, results) {
            res.json({
                status: 'ok'
            })
        });
    })
}