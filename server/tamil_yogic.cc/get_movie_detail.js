var express = require('express')
var request = require('request');
var cheerio = require('cheerio');
var async = require("async");
var app = express()

var url = "http://fastplay.cc/embed-g0dkr59chls9.html"
var got_movie_detail = {}

request(url, function(error, response, html) {
    if(!error){
        var $ = cheerio.load(html, {xmlMode: false});
        got_movie_detail['screan_shot'] = $("#vplayer img").attr('src');
        var compareString = 'jwplayer("vplayer")';

        $('script').each(function(i){
            if($('script').get()[i].children[0]){
                var data = $('script').get()[i].children[0].data 
                if(data.indexOf(compareString) !== -1){
                    var firstSplit = data.split('setup(')[1];
                    var secondSplit = firstSplit.split(');')
                    var replaceList = [
                        "sources", "file", "label", "image", "duration", "width", "height" , "aspectratio", "skin", "primary" , "preload" ,"startparam"
                        , "tracks", "captions", "color", "fontSize", "fontFamily" ,"backgroundOpacity", "abouttext", "aboutlink"
                    ]
                    var formatedObject = secondSplit[0]

                    for(var i = 0; i < replaceList.length; i++) {
                        var regex = new RegExp(replaceList[i]+":", 'g');
                        formatedObject = formatedObject.replace(regex, '"'+replaceList[i]+'":')
                    }

                    formatedObject = formatedObject.replace(/'/g, '"')
                   
                    got_movie_data = JSON.parse(formatedObject);

                    var construct_movie_data = {
                        'sources' : got_movie_data.sources,
                        "image": got_movie_data.image,
                        "duration": got_movie_data.duration
                    }

                    console.log(construct_movie_data)


                } else {
                    // console.log("----")
                    // console.log(i, "not in this string");   
                }                                    
            } else {
                // console.log("----")
                // console.log(i, "not found!", movie_detail.vidmateLink);
            }
        })
    }
});

app.listen(3003, function () {
  console.log('Example app listening on port 3003!')
})