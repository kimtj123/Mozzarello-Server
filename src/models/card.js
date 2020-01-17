const mongoose = require("mongoose");
const { Schema } = mongoose;

// 스키마
const Card = new Schema({          
    boardID : String,
    title : String,    
    list : Array
});

Card.statics.makeCard = function(ctx) {
    console.log("Card ctx 확인", ctx)
    const card = new this({
        boardID : ctx.boardID,
        title : ctx.title,    
        list : ctx.list
    });  
    
    return card.save();
}
module.exports = mongoose.model('Card', Card);
