const db = require('../db/index');
const path = require('path');

// 整理要插入数据库的文章信息对象：
const articleInfo = {
  // 标题、内容、状态、所属的分类Id
  ...req.body,
  // 文章封面在服务器端的存放路径
  cover_img: path.join('/uploads', req.file.filename),
  // 文章发布时间
  pub_date: new Date(),
  // 文章作者的Id
  author_id: req.user.id,
}

// 发布新文章的路由处理函数
exports.addArticle = (req, res) => {
  if (req.file || req.file.fieldname !== 'cover_img') { return res.cc('需要上传文章封面') };
  const sql = 'insert into ev_articles set ?';
  db.query(sql, articleInfo, (err, results) => {
    if (err) { return res.cc(err) };
    if (results.affectedRows !== 1) { return res.cc('发布文章失败') };
    res.cc('发布文章成功');
  })
}