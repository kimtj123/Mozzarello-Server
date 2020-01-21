const mongoose = require("mongoose");
const Card = require('../models/card');
const Joi = require('joi');

exports.makeCard = async (ctx) => {
    console.log("컨트롤러 카드만들기 :: ", ctx)
    const schema = Joi.object().keys({
        boardID: Joi.string(),
        title: Joi.string(),
        list: Joi.array(),        
    })
    console.log("컨트롤러 요청바디",ctx.request.body)
    const result = Joi.validate(ctx.request.body, schema);
    if(result.error) {
        ctx.status = 400;
        return;
    }

    let card;
    console.log("보드생성 ctx.req.body :: ", ctx.request.body);
    try {
        card = await Card.makeCard(ctx.request.body);
    } catch (e) {
        ctx.throw(500, e);
    }
    console.log("card :: ", card)    


    let request = {
        boardID : card.boardID,
        title : card.title,        
        list : card.list
    }    
    ctx.status = 201;
    ctx.body = request;     
}

exports.findCards = async (ctx) => {
    let boardID = ctx.params.id        
    let cards;
    try {
        // key 에 따라 findByEmail 혹은 findByUsername 을 실행합니다.
        cards = await Card.find({boardID : boardID})     
    } catch (e) {
        ctx.throw(500, e);
    }
    // console.log("findCard-cards :: ",cards)
    ctx.body = {
        cards: cards
    };
}

exports.deleteCard = async (ctx) => {
    const { id } = ctx.params; // URL 파라미터에서 id 값을 읽어옵니다.

    try {
        console.log(await Card.findOneAndDelete({ _id : id })); 
        //deleteOne 삭제, findOneAndDelete 삭제 후 리턴
    } catch (e) {
        if(e.name === 'CastError') {
            ctx.status = 400;
            return;
        }
    }
    ctx.body = { 
        "delete" :  id
    }
    ctx.status = 204; // No Content
}

// list 관련

exports.modifyTitle = async (ctx) => {
    console.log("수정 요청 :: ", ctx.request.body)
    let lists;
    let cardID = ctx.params.id
    let newTitle = ctx.request.body.title;   
    try {
        // key 에 따라 findByEmail 혹은 findByUsername 을 실행합니다.
        lists = await Card.find({_id : cardID})            
        console.log("lists.list :: ", lists[0].title = newTitle)
    } catch (e) {
        ctx.throw(500, e);
    }

    ctx.body = lists;
    return lists[0].save();
}

exports.addList = async (ctx) => {
    let lists;
    let cardID = ctx.params.id
    let newList = ctx.request.body;       
    newList._id = new mongoose.Types.ObjectId()
    try {
        // key 에 따라 findByEmail 혹은 findByUsername 을 실행합니다.
        lists = await Card.findOne({_id : cardID})                    
        lists.list.push(newList)                
    } catch (e) {
        ctx.throw(500, e);
    }

    ctx.body = lists;
    return lists.save();
}

exports.deleteList = async (ctx) => {            
    const { cardID, listID } = ctx.params; // URL 파라미터에서 id 값을 읽어옵니다.
    let targetCard = await Card.findOne({_id : cardID});
    let newCard = await Card.deleteList(targetCard, listID);    
    let cardHaveTargetList 
    try 
    {
       cardHaveTargetList = await Card.findOneAndUpdate(
        { _id : cardID }, // condition
        newCard,
        {
            upsert: true, // 이 값을 넣어주면 데이터가 존재하지 않으면 새로 만들어줍니다
            new: true // 이 값을 넣어줘야 반환하는 값이 업데이트된 데이터입니다.                      
        } // update
        );
    } 
    catch (e) {
        if(e.name === 'CastError') {
            ctx.status = 400;
            return;
        }
    }    
    ctx.status = 204; // No Content        
    ctx.body = cardHaveTargetList    
    return ;
}

exports.changeList = async (ctx) => {
    const { cardID, listID } = ctx.params; // URL 파라미터에서 id 값을 읽어옵니다.
    const { body } = ctx.request;    
    let targetCard = await Card.findOne({_id : cardID});
    console.log("몸 :: ", body);
    let newCard = await Card.changeList(targetCard, listID, body);
    let cardHaveChangeList
    try 
    {
        cardHaveChangeList = await Card.findOneAndUpdate(
            { _id : cardID }, // condition
            newCard,
            {
                upsert: true, // 이 값을 넣어주면 데이터가 존재하지 않으면 새로 만들어줍니다
                new: true, // 이 값을 넣어줘야 반환하는 값이 업데이트된 데이터입니다. 
                useFindAndModify : true                     
            } // update
            );
    } 
    catch (e) 
    {
        if(e.name === 'CastError') {
            ctx.status = 400;
            return;
        }
    }    
    console.log("cardHaveChangeList :: ", cardHaveChangeList);
    ctx.status = 204; // No Content        
    ctx.body = cardHaveChangeList    
    return ;
}