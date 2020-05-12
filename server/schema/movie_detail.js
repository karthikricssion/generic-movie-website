var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;

var movieDetailSchema = new Schema({ 
    original_title: String,
    is_dubbed: Boolean,
    embed_link: String,
    released_year: String,
    movie_db_id: String
});

var movieDetail = mongoose.model('MovieDetail', movieDetailSchema);

module.exports = {
   movieSchema: movieDetail
};
