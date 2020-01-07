const Router = require('koa-router');

const users = new Router();

const userCtrl = require('./users.controller');


users.get('/', userCtrl.list);
users.get('/:id', userCtrl.get);
users.post('/', userCtrl.create);
users.delete('/', userCtrl.delete);
users.put('/', userCtrl.replace);
users.patch('/', userCtrl.update);

module.exports = users;