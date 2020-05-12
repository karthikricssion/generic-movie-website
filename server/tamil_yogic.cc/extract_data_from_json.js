var express = require('express')
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require("async");
var app = express()


var temp_movies_data = null
var all_movie_details = []

fs.readFile('./movies_with_details.json', 'utf8', function (err, data) {
  if (err) throw err;
  var temp = JSON.parse(data);
  temp_movies_data = temp['list']
  
  formate_movie_json(temp_movies_data);
});

function formate_movie_json(dataList) {
    for(var i =0; i < dataList.length; i++){
        var movie = {}

        // gathering exsisting tile
        movie['title'] = dataList[i].tmp_title
        
        // extracting_movie_name
        movie['original_title'] = movie.title.replace("Permanent Link to ", "");
        if(movie.original_title.indexOf('(') != -1){
            var temp_mve_name = movie.original_title.split('(')
            movie['original_title'] = temp_mve_name[0]
        } else {
            var temp_mve_name = movie.original_title.split('[')
            movie['original_title'] = temp_mve_name[0]
        }
        

        // extracting_weather_its_dubbed
        if(movie.title.indexOf("Dubbed") != -1){
            movie['is_dubbed'] = true;
        } else {
            movie['is_dubbed'] = false
        }

        // setting_permenant_link
        movie['embed_link'] = dataList[i].embed_link
        
        // extracting_year
        var matchs = movie.title.match(/\d+/g)
        matchs = matchs.filter(e => e.length == 4)
        if(matchs.length > 1){
            movie['released_year'] = matchs[1]
        } else {
            movie['released_year'] = matchs[0]
        }

        all_movie_details.push(movie)


        var temp_movies_urls_obj = {}
        temp_movies_urls_obj['list'] = all_movie_details
        
        if(temp_movies_urls_obj){
            fs.writeFile('./movies_with_details.json', JSON.stringify(temp_movies_urls_obj), function (err) {
                if (err) return console.log(err);
            });
        }
    }
}