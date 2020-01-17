const mongoose = require("mongoose");
const { Schema } = mongoose;

// 스키마
const Card = new Schema({            
    title : String,    
    list : Array
});

module.exports = mongoose.model('Card', Card);
