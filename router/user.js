const express = require('express');
const router = express.Router();
const userHandler = require('../router_handler/user')

// 导入路由处理函数
require('../router_handler/user');

// 导入需要的验证规则对象
const { reg_login_schema } = require('../schema/user');

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');

// 用户注册
router.post('/reguser', expressJoi(reg_login_schema), userHandler.reqUser);

// 登录
router.post('/login', expressJoi(reg_login_schema), userHandler.login);

module.exports = router;