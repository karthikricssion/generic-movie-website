var express = require('express')
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require("async");
var app = express()


var temp_movies_urls = null
var all_movie_details = []

fs.readFile('./movies_url.json', 'utf8', function (err, data) {
  if (err) throw err;
  var temp = JSON.parse(data);
  temp_movies_urls = temp['list']
  
  fram_movie_json(temp_movies_urls);
});


function fram_movie_json(data) {
    async.map(data, function(url, callback) {
      request(url, function(error, response, html) {
        if(!error){
            var $ = cheerio.load(html);
            var temp = {}
            temp['tmp_title'] = $("#content h1 a").attr('title')
            temp['embed_link'] = $("#content iframe").attr('src')
            
        }


        if(temp['tmp_title'] != undefined && temp['embed_link'] != undefined){
            all_movie_details.push(temp)
        }

        var temp_movies_urls_obj = {}
        temp_movies_urls_obj['list'] = all_movie_details
        
        if(temp_movies_urls_obj){
            fs.writeFile('./movies_with_details.json', JSON.stringify(temp_movies_urls_obj), function (err) {
                if (err) return console.log(err);
            });
        }   

        callback(error, html);
      });
    }, function(err, results) {
      console.log(err);
    });
}






app.listen(3003, function () {
  console.log('Example app listening on port 3000!')
})