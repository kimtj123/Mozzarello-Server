const Router = require('koa-router');
const users = new Router();
const userCtrl = require('./users.controller');
const boardsCtrl = require('./boards.controller');
const cardCtrl = require('./cards.controller');


// user 스키마 관련
users.post('/singup', userCtrl.localRegister);
users.post('/login', userCtrl.localLogin);
users.post('/logout', userCtrl.logout);

users.get('/exists/:key(email||username)/:value', userCtrl.exists);
users.get('/check', userCtrl.check);

// board 스키마 관련
users.post('/boards', boardsCtrl.makeBoard); // 보드생성
users.get('/boards/:value', boardsCtrl.findBoards);  // 보드찾기
users.delete('/deleteboard/:id', boardsCtrl.deleteBoard);  // 보드삭제

// card 스키마 관련
users.post('/boards/card', cardCtrl.makeCard)

module.exports = users;