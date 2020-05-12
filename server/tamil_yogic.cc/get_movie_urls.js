var express = require('express')
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require("async");
var app = express()


var totalPage = 16;
var baseURL = "http://tamilyogi.cc/category/tamilyogi-bluray-movies/page/";
var tmp_page_urls = []
var tmp_movies_urls = []


for(var i = 1; i <= totalPage; i++) {
    tmp_page_urls.push(baseURL+i+'/');
}

async.map(tmp_page_urls, function(url, callback) {
  request(url, function(error, response, html) {
    if(!error){
        var $ = cheerio.load(html);
        $("#loop li").each((i, li) => {
            if($(li).children('.postcontent').children('h2').children('a').attr('href') != undefined){
                tmp_movies_urls.push($(li).children('.postcontent').children('h2').children('a').attr('href'));
            }            
        })
    }

    var temp_movies_urls_obj = {}
    temp_movies_urls_obj['list'] = tmp_movies_urls
    
    if(temp_movies_urls_obj){
        fs.writeFile('./server/tamil_yogic.cc/movies_url.json', JSON.stringify(temp_movies_urls_obj), function (err) {
            if (err) return console.log(err);
        });
    }   

    callback(error, html);
  });
}, function(err, results) {
  console.log(err);
});



app.listen(3003, function () {
  console.log('Example app listening on port 3000!')
})