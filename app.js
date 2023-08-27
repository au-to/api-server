const express = require('express');
const app = express();

// 配置CORS跨域,注册cors为全局中间件
const cors = require('cors');
app.use(cors());

// 配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }));

// 引入表单验证的中间件
const joi = require('@hapi/joi');

// 引入用于解析token的密钥
const config = require('./config');

// 解析 token 的中间件
const expressJWT = require('express-jwt');

// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }));

// 注册一个错误处理的全局中间件
app.use((err, req, res, next) => {
  // status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }

  // 数据验证失败
  if (err instanceof joi.ValidationError) return res.cc(err)

  // 捕获身份认证失败的错误
  if (err.name === 'UnauthorizedError') {
    return res.cc('身份认证失败');
  }
  next();
})

// 导入并注册用户路由模块
const userRouter = require('./router/user');
app.use('/api', userRouter);

// 导入并注册个人中心的路由模块
const userinfoRouter = require('./router/userinfo');
app.use('/my', userinfoRouter);

// 导入文章分类路由模块
const artCateRouter = require('./router/artcate');
app.use('/my/article', artCateRouter);

// 导入文章管理路由模块
const articleRouter = require('./router/article');
app.use('my/article', articleRouter);

// 托管静态资源文件
app.use('/uploads', express.static('./uploads'));

// 启动web服务器
app.listen('3007', () => {
  console.log('server running at http://127.0.0.1:3007');
})