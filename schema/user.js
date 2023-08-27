const joi = require('@hapi/joi');
// 用户名验证规则
const username = joi.string().alphanum().min(1).max(10).required();

// 密码验证规则
const password = joi.string().pattern(/^[\S]{6,12}$/).required();

//定义 id, nickname, emial 的验证规则
const id = joi.number().integer().min(1).required();
const nickname = joi.string().required();
const email = joi.string().email().required();

// 定义用户头像验证规则
// dataUri() 指的是如下格式的字符串数据：
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const avatar = joi.string().dataUri().required()

// 注册与登录的表单验证规则对象
exports.reg_login_schema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    username,
    password,
  },
}

// 更新用户信息的表单验证对象
exports.update_userinfo_schema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    id,
    nickname,
    email,
  },
}

// 重置密码的表单验证对象
exports.update_password_schema = {
  body: {
    // 使用 password 这个规则，验证 req.body.oldPwd 的值
    oldPwd: password,
    // 使用 joi.not(joi.ref('oldPwd')).concat(password) 规则，验证 req.body.newPwd 的值
    // 解读：
    // 1. joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
    // 2. joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
    // 3. .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
    newPwd: joi.not(joi.ref('oldPwd')).concat(password),
  },
}

// 更新头像的验证规则对象
exports.update_avatar_schema = {
  body: {
    avatar,
  },
}