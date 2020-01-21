const Board = require('../models/board');
const Joi = require('joi');

exports.makeBoard = async (ctx) => {
    
    const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        title: Joi.string(),
        list: Joi.array(),
        color: Joi.string()
    })

    const result = Joi.validate(ctx.request.body, schema);
    if(result.error) {
        ctx.status = 400;
        return;
    }

    let board;
    console.log("보드생성 ctx.req.body :: ", ctx.request.body);
    try {
        board = await Board.makeBoard(ctx.request.body);
    } catch (e) {
        ctx.throw(500, e);
    }
    console.log("board :: ", board)    


    let request = {
        boardID : board._id,
        title : board.title,
        list : board.list,        
        color : board.color
    }    
    ctx.status = 201;
    ctx.body = request; // 가입한 이메일로 응답

    console.log("ctx.request :: ",ctx.request.body)
}

exports.findBoards = async (ctx) => {
    let email = ctx.params.value        
    let boards;
    try {
        // key 에 따라 findByEmail 혹은 findByUsername 을 실행합니다.
        boards = await Board.find({email : email})     
    } catch (e) {
        ctx.throw(500, e);
    }

    ctx.body = {
        boards: boards
    };
    
}

exports.deleteBoard = async (ctx) => {
    const { id } = ctx.params; // URL 파라미터에서 id 값을 읽어옵니다.

    try {
        console.log(await Board.findOneAndDelete({ _id : id })); 
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