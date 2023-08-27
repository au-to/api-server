const express = require('express');
const router = express.Router();

// 导入用于数据验证的中间件
const expressJol = require('@escook/express-joi');

// 导入文章分类的验证规则
const { add_cate_schema,delete_cate_schema,get_cate_schema,update_cate_schema } = require('../schema/artcate');

// 导入文章分类的路由处理函数模块
const artcate_handler = require('../router_handler/artcate');

// 获取文章分类列表数据
router.get('/cates', artcate_handler.getArticleCates);

// 新增文章分类的路由
router.post('/addcates', expressJol(add_cate_schema), artcate_handler.addArticleCates);

// 根据id删除文章分类
router.get('/deletecate/:id', expressJol(delete_cate_schema), artcate_handler.deleteCateById);

// 根据 Id 获取文章分类
router.get('/cates/:id', expressJol(get_cate_schema), artcate_handler.getArtCateById);

// 根据id更新文章分类
router.post('/updatecate', expressJol(update_cate_schema), artcate_handler.updateCateById);

module.exports = router;