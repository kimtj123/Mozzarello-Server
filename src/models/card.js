const mongoose = require("mongoose");
const { Schema } = mongoose;

// 스키마
const Card = new Schema({          
    boardID : String,
    title : String,    
    list : []
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

Card.statics.deleteList = async function(card, listID) {  
    let targetIndex = card.list
    .indexOf(card.list
    .find(element => 
        element._id.toString() === listID
        )
    );
    card.list.splice(targetIndex, 1);

    return card
}

Card.statics.changeList = async function(card, listID, body) {  
    console.log("changeList card :: ", card);
    console.log("changeList listID :: ", listID);
    console.log("changeList body.content :: ", body);

    let targetIndex = card.list
    .indexOf(card.list
    .find(element => {
        console.log("element :: ",element)
        return element._id.toString() === listID
        }
        )
    );
    console.log("targetIndex :: ", targetIndex)
    console.log("card.list[targetIndex] :: ", card.list[targetIndex])
    console.log("card.list[targetIndex].content :: ", card.list[targetIndex]["content"] = body.content)
    // card.list[targetIndex].content = body.content;

    return card
}
module.exports = mongoose.model('Card', Card);
