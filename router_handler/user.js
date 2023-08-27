/*定义和用户相关的路由处理函数*/

// 导入数据库操作模块
const db = require('../db/index');

// 使用bcryptjs对明文密码进行加密
const bcrypt = require('bcryptjs');

// 引入jswebtoken中间件
const jwt = require('jsonwebtoken');

// 引入用于生成加密和还原token的字符串
const config = require('../config');

// 用户注册的处理函数
exports.reqUser = (req, res) => {
  // 获取客户端发送到服务器的用户信息
  const userInfo = req.body;

  // 对表单数据进行合法性校验
  if (!userInfo.username || !userInfo.password) {
    res.send({
      status: 1,
      message: '用户名或密码不合法'
    })
  }

  // 检验用户名的唯一性
  const sql = 'select * from ev_users where username=?';
  db.query(sql, [userInfo.username], (err, results) => {
    if (err) {
      return res.cc(err);
    } else {
      if (results.length == 1) { res.cc('用户名被占用!') };

      // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
      userInfo.password = bcrypt.hashSync(userInfo.password, 10);

      // 插入新用户到数据库
      const sql = 'insert into ev_users set ?';
      db.query(sql, { username: userInfo.username, password: userInfo.password }, function (err, results) {
        // 执行 SQL 语句失败
        if (err) return res.cc(err);
        // SQL 语句执行成功，但影响行数不为 1
        if (results.affectedRows !== 1) {
          return res.cc('注册用户失败，请稍后再试！');
        }
        // 注册成功
        res.cc(0);
      })
    }
  })
}

// 登录处理函数
exports.login = (req, results) => {
  // 根据用户名查询用户数据
  const userInfo = req.body;
  const sql = 'select * from ev_users where username=?';
  db.query(sql, userInfo.username, (err, results) => {
    if (err) { return res.cc(err) };
    if (res.length !== 1) { return res.cc('登录失败') };

    // 判断用户输入的登录密码是否和数据库中的密码一致
    const compareResult = bcrypt.compareSync(userInfo.password, results[0].password);
    if (!compareResult) {
      return res.cc('登录失败');
    }
    
    // 登录成功，生成 Token 字符串
    // 清空用户敏感信息
    const user = { ...results[0], password: '', user_pic: '' };
    // 将用户信息对象加密成 Token 字符串：
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: '10h' });
    res.send({
      status: 0,
      message: '登录成功',
      // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
      token: 'Bearer' + tokenStr 
    })
  })
}