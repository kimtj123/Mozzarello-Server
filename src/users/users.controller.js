const User = require('../models/users');
const Board = require('../models/board');
const Joi = require('joi');
const { decodeToken } = require('../token/token');





// 로컬 회원가입
exports.localRegister = async (ctx) => {
    const schema = Joi.object().keys({
        username: Joi.string().min(2).max(15).required(),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6)
    })

    const result = Joi.validate(ctx.request.body, schema);

    // 에러 발생 시
    if(result.error) {
        ctx.status = 400;
        return;
    }
    console.log("ctx.request :: ",ctx.request.body)

    // 아이디 / 이메일 중복 체크
    let existing = null;
    try {
        existing = await User.findByEmailOrUsername(ctx.request.body);
    } catch (e) {
        ctx.throw(500, e);
    }

    console.log("existing :: ", existing)

    if(existing) {
        // 중복되는 아이디/이메일이 있을 경우
        ctx.status = 409; // Conflict
        // 어떤 값이 중복되었는지 알려줍니다
        ctx.body = {
            key: existing.email === ctx.request.body.email ? 
            '이미 존재하는 이메일주소입니다.' :  // 이메일 중복시 메시지
            '이미 존재하는 유저명입니다.' // 유저명 중복시 메시지
        };
        return;
    }

    // 계정 생성
    let account = null;
    console.log("계정생성 ctx.req.body :: ", ctx.request.body);
    try {
        account = await User.localRegister(ctx.request.body);
    } catch (e) {
        ctx.throw(500, e);
    }
    console.log("account :: ", account)
    
    let token = null;
    try {
        token = await account.generateToken();
    } catch (e) {
        ctx.throw(500, e);
    }

    let request = {
        username : account.username,
        email : account.email,        
    }
    ctx.cookies.set('access_token', token, { 
        httpOnly: true, 
        maxAge: 1000 * 60 * 60 * 24 * 7 
    });
    ctx.body = request; // 가입한 이메일로 응답
};

// 로컬 로그인
exports.localLogin = async (ctx) => {
    console.log("로그인 CTX :: ", ctx.request.response)
    // 데이터 검증
    const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if(result.error) {
        ctx.status = 400; // Bad Request        
        return;
    }

    const { email, password } = ctx.request.body; 

    let account = null;
    try {
        // 이메일로 계정 찾기
        account = await User.findByEmail(email);
    } catch (e) {
        ctx.throw(500, e);
    }

    if(!account) 
    {
        // 유저가 존재하지 않거나 || 비밀번호가 일치하지 않으면
        ctx.status = 403; // Forbidden
        ctx.body = ["이메일이 존재하지 않습니다."]
        return;
    }
    else if(!account.validatePassword(password))
    {
        ctx.status = 403; // Forbidden
        ctx.body = ["비밀번호가 일치하지 않습니다."]
        return;
    }

    let token = null;
    try {
        token = await account.generateToken();
    } catch (e) {
        ctx.throw(500, e);
    }

    ctx.cookies.set('access_token', 
    token, 
    { 
        // 클라이언트측 스크립트가 쿠키에 접근할 때 발생하는 리스크를 감소시킨다.
        httpOnly: true, 
        // 쿠키유효시간, 현재는 1시간
        maxAge: 1000 * 60 * 60 * 100
    }
    );
    ctx.body = {        
        username : account.username,
        email : account.email,                
    };
};

// 이메일 / 아이디 존재유무 확인
exports.exists = async (ctx) => {
    // http://localhost:4000/users/exists/email/kimtajung1@gmail.com
    const { key, value } = ctx.params;
    let account = null;
    
    try {
        // key 에 따라 findByEmail 혹은 findByUsername 을 실행합니다.
        account = await (key === 'email' ? 
        User.findByEmail(value) : 
        User.findByUsername(value));            
    } catch (e) {
        ctx.throw(500, e);
    }

    ctx.body = {
        exists: account !== null
    };
};

// 로그아웃
exports.logout = async (ctx) => {
        ctx.cookies.set('access_token', null, {
            maxAge: 0, 
            httpOnly: true
        });
        ctx.status = 204;
        ctx.body = ["로그아웃되었습니다."]
        // ctx.redirect('http://localhost:3000/') // redirect to another page
};

// 현재 로그인된 유저의 정보를 알려주는 API
exports.check = async (ctx) => {    

    const { user } = ctx.request;
    // console.log("check :: ", ctx.request)
    // console.log("check.user :: ", ctx.request.user)
    
    if(!user) {
        ctx.status = 403; // Forbidden
        return;
    } 
    
    ctx.body = user;
};
