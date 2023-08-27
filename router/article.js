// 文章管理路由模块
const express = require('express');
const router = express.Router();

// 导入解析 formdata 格式表单数据的包
const multer = require('multer');
const path = require('path');

// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads') });

// 导入表单数据验证的中间件
const expressJoi = require('@escook/express-joi');

// 导入验证规则对象
const { add_article_schema } = require('../schema/article');

// 导入处理函数模块
const article_handler = require('../router_handler/article');

// 发布新文章路由
// 先使用multer解析表单数据
// 再使用expressJoi对解析的表单数据进行验证
router.post('/add', upload.single('cover_img'),expressJoi(add_article_schema), article_handler.addArticle);

module.exports = router;