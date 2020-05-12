var express = require('express')
var app = express()
var MovieDetail = require('../schema/movie_detail').movieSchema;
var Mongoose = require('mongoose');

var fs = require('fs');

Mongoose.connect("mongodb://localhost/movies_list_v2"); 
var db = Mongoose.connection; 
db.on('error', console.error.bind(console, 'connection error:')); 
db.once('open', function callback () { 
    console.log('DB initialised successfully'); 
    app.locals.db = db; 
}); 

var temp_movies_data = null
var all_movie_details = []

fs.readFile('../tamil_yogic.cc/movies_with_details.json', 'utf8', function (err, data) {
  if (err) throw err;
  var temp = JSON.parse(data);
  temp_movies_data = temp['list']
  
  save_movie_to_mongo(temp_movies_data);
});

function save_movie_to_mongo(movies){
    for(var i = 0; i < movies.length; i++) {
        var movie = new MovieDetail({
            original_title: movies[i].original_title,
            is_dubbed: movies[i].is_dubbed,
            embed_link: movies[i].embed_link,
            released_year: movies[i].released_year,
            movie_db_id: null
        });

        movie.save((err, data) => {
            if(err){
                console.log('err', err)
            }
            else{
                console.log(data._id)
            }
        });
    }
}