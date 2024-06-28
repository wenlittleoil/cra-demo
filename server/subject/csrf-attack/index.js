/**
 * 跨站请求伪造csrf原理
 * index模拟受攻击的服务端API；
 * index2模拟浏览器端网站一（正常站点），index3模拟浏览器端网站二（非法站点），它们的域名完全不同，然后同时向服务端API发起请求
 */
const express = require('express')
const app = express()
const port = 3001

app.use((req, res, next) => {
  // 例如GET, POST的简单请求会忽略Access-Control-Allow-Methods, 或者说该头默认配置了GET,POST方法
  // res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  next()
})

app.use(express.cookieParser())

app.post('/api/login', (req, res) => {
  // 模拟登录过程发放登录标示
  res.cookie("sessionId", "abc123");
  res.send('login success!');
});

app.post('/api/logout', (req, res) => {
  // 模拟退出登录过程，回收登录标示
  res.clearCookie("sessionId");
  res.send('logout success!');
});

app.get('/api/protected-resource', (req, res) => {
  // 模拟请求获取受保护的资源
  const sid = req.cookies['sessionId'];
  console.log('登录标示:', sid)
  if (sid) {
    res.send('获取受保护的资源-成功!');
  } else {
    res.send('获取受保护的资源-失败');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
