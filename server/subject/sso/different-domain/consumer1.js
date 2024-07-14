/**
 * 业务方1（sso消费端）
 * 采用前后端分离架构
 */
const axios = require('axios')
const express = require('express')
const path = require('path')
const app = express()
const session = require('express-session');
const port = 3001

// 公共鉴权中间件
const authenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(200).json({ errCode: 302, data: null });
  }
  next();
}

app.use(session({
  secret: 'business-consumer-one',
  resave: false,
  saveUninitialized: true
}))
 
const authCenter = "http://sso.center.com:3000";
app.use(async (req, res, next) => {
  const { ticket } = req.query;
  if (ticket) {
    try {
      /**
       * 以ticket为凭证，前往sso授权服务中心校验并交换得到用户信息
       * （这里可选择采用jwt对用户信息进行非对称加密）
       */
      const res = await axios.get(`${authCenter}/check/verifyAndGetUserInfo?ticket=${ticket}`);
      console.log("[业务方根据ticket获取用户信息]：", ticket, res)
      req.session.user = res.data;
    } catch(err) {
      console.log('[校验并交换得到用户信息-发生失败]', ticket, err);
    }
  }
  next()
});

app.get("/", (req, res) => {
  const file = path.join(__dirname, 'consumer1.html')
  res.sendFile(file);
});

// 访问受到保护的资源
app.get("/api/protected-resource", authenticated, (req, res) => {
  res.status(200).json({ errCode: 0, data: req.session.user });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
