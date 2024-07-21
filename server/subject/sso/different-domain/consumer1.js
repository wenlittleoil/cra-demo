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
const APP_NAME = "consumer1"

// 公共鉴权中间件
const authenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(200).json({ errCode: 302, data: null });
  }
  next();
}

// 开发环境使用
const sessionStore = new session.MemoryStore();
// 生成或维持session
app.use(session({
  secret: 'business-consumer-one',
  resave: false,
  saveUninitialized: true,
  store: sessionStore, 
}))
 
const authCenter = "http://sso.center.com:3000";
app.use(async (req, res, next) => {
  const { ticket } = req.query;
  if (ticket) {
    try {
      /**
       * 以ticket为凭证，前往sso授权服务中心校验并交换得到用户信息（这里可选择采用jwt对用户信息进行非对称加密），
       * 并把自己本地sessionID注册到授权中心（与授权中心的全局sessionID完成关联, 供single-logout使用）。
       */
      const response = await axios.get(`${authCenter}/check/verifyAndGetUserInfo?ticket=${ticket}&app=${APP_NAME}&sessionID=${req.sessionID}`);
      const resBody = response.data;
      console.log("[业务方根据ticket获取用户信息]：", ticket, resBody)
      req.session.user = resBody.data;
    } catch(err) {
      console.log('[校验并交换得到用户信息-发生失败]', ticket, err);
    }
  }
  next()
});

// 访问前端页面
app.get("/", (req, res) => {
  const file = path.join(__dirname, 'consumer1.html')
  res.sendFile(file);
});

// 访问受到保护的资源
app.get("/api/protected-resource", authenticated, (req, res) => {
  res.status(200).json({ errCode: 0, data: req.session.user });
});

// 业务方提供注销本地session登录态的内部API，需要在sso授权服务中心完成注册，并在用户注销登录时完成调用
app.post("/internal/api/logout", async (req, res) => {
  const { sessionID } = req.query;
  // 清除本地登录态
  sessionStore.destroy(sessionID, err => {
    console.log("/internal/api/logout", sessionID, err)
    if (err) {
      return res.status(400).json({ errCode: 999, data: null, message: 'Clear local session failed' });
    }
    res.status(200).json({ errCode: 0, data: null, message: 'Clear local session successfully' });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
