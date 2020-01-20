const mongoose = require("mongoose");
const { Schema } = mongoose;

// 스키마
const Card = new Schema({          
    boardID : String,
    title : String,    
    list : Array
});

// const List = new Schema({          
//     content : String
// });

Card.statics.makeCard = function(ctx) {
    console.log("Card ctx 확인", ctx)
    const card = new this({
        boardID : ctx.boardID,
        title : ctx.title,    
        list : ctx.list
    });  
    
    return card.save();
}

Card.statics.findCards = function(ctx){
    return this.find({boardID : ctx.id}).exec();
}

Card.statics.addList = function(ctx){
    let newList = {        
        content : ctx.content
    }
    this.list.push(newList)
    return this.save()
}
module.exports = mongoose.model('Card', Card);
