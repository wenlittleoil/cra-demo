/**
 * 跨站请求伪造csrf原理研究
 * index模拟受攻击的服务端API；
 * index2模拟浏览器端网站一（正常站点），index3模拟浏览器端网站二（非法站点），它们的域名完全不同，然后同时向服务端API发起请求
 * 
 * 研究结果（重要）：
 *    1、当浏览器端站点和服务端API域名完全不同时（即一级域名也不同），
 *    可通过特殊设置进行跨源请求，但cookie无法通过请求头被携带出去发送给服务端API（即完全无法共享cookie），哪怕它是通过服务端API进行Set-Cookie的；
 * 
 *    2、在不同域的浏览器端站点里，去调用服务端API进行Set-Cookie，虽然该cookie属于服务端API的，但也无法在服务端API页面里被发送给服务端API，
 *     由此可以得知，浏览器对于cookie共享有非常严格的限制
 */
const express = require('express')
const https = require('https')
const { secureServerOptions } = require('../../config')

const app = express()
const port = 3001
const cookieParser = require('cookie-parser')

const allowOrigins = [
  'http://localhost:3002',
  'http://localhost:3003',
];

app.use((req, res, next) => {
  // 例如GET, POST的简单请求会忽略Access-Control-Allow-Methods, 或者说该头默认配置了GET,POST方法
  // res.setHeader('Access-Control-Allow-Methods', 'GET, POST')

  const reqOrigin = req.headers['origin'];
  if (allowOrigins.includes(reqOrigin)) {
    res.setHeader('Access-Control-Allow-Origin', reqOrigin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  next()
})

app.use(cookieParser())

app.get('/', (req, res) => {
  console.log("req.cookies", req.cookies)
  const htmlStr = `
    <script>
      function onSet() {
        fetch("/api/login", {
          method: 'POST',
        }).then(res => res.text()).then(res => {
          console.log("登录结果", res)
        });
      }
    </script>
    <div>
      <h1>访问API服务器成功</h1>
      <button onclick="onSet()">设置cookie</button>
    </div>
  `;
  res.send(htmlStr);
});

app.post('/api/login', (req, res) => {
  // 模拟登录过程发放登录标示
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  res.cookie("sessionId", "abc123", {
    sameSite: "none",
    secure: true,
    
    httpOnly: true,
    domain: 'localhost',
    maxAge: expiresIn
  });
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
  console.log('登录标示:', sid);
  if (sid) {
    res.send('获取受保护的资源-成功!');
  } else {
    res.send('获取受保护的资源-失败');
  }
});

https.createServer({ ...secureServerOptions }, app).listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
