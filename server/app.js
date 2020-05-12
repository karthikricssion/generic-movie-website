var express = require('express')
var app = express()
var async = require("async");
var fs = require('fs');
var Mongoose = require('mongoose');
var bodyParser = require('body-parser')



// db connections
Mongoose.connect("mongodb://localhost/movies_list_v2"); 
var db = Mongoose.connection; 
db.on('error', console.error.bind(console, 'connection error:')); 
db.once('open', function callback () { 
    console.log('DB initialised successfully'); 
    app.locals.db = db; 
});

app.use(express.static('./app'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('json spaces', 40);
require('./routes/main_routes')(app);

app.get('*', function(req, res){
    res.sendFile('index.html', { root: "app" });
});

app.listen(3003, function () {
  console.log('Example app listening on port 3003!')
})




