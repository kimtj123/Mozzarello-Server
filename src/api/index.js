const Router = require('koa-router');

const api = new Router();
const users = require('./users');


api.use('/users', users.routes());

module.exports = api;