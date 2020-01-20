const mongoose = require("mongoose");
const { Schema } = mongoose;

// 스키마
const Board = new Schema({        
    email : String,
    title : String,
    color : String,
    list : [
    {
        "title" : String,
        "list" : Array
    }],
});


Board.statics.makeBoard = function(ctx) {
    console.log("ctx 확인", ctx)
    const board = new this({
        email : ctx.email,
        title : ctx.title,
        color : ctx.color,
        list : ctx.list
    });  
    
    console.log("보드추가 :: ", board);
    return board.save();
}


module.exports = mongoose.model('Board', Board);
