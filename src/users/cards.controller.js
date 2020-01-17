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