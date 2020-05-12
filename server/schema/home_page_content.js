var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;

var HomePageSchema = new Schema({ 
    dataKeys: String,
});

var homePage = mongoose.model('HomePage', HomePageSchema);

module.exports = {
   homePageSchema: homePage
};