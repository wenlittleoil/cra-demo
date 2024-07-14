/**
 * sso授权服务中心
 * 采用前后端一体化架构
 */
const express = require('express')
const app = express()
const session = require('express-session');
const md5 = require('md5');
const port = 3000
const { secret } = require('./common')

const users = [
  {
    username: 'wen',
    password: '123',
  }
];

const html = str => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>sso授权服务中心</title>
    </head>
    <body>
      ${str}
    </body>
  </html>
`;

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => {
  console.log('req.session: ', req.session)
  const user = req.session.user;
  if (user) {
    res.send(html(`
      <form action="/auth/logout" method="post">
        <div>Hello i'm ${JSON.stringify(user)}</div>
        <div><button type="submit">注销</button></div>
      </form>
    `));
  } else {
    res.send(html(`
      <form action="/auth/login" method="post">
        <div><input name="username" placeholder="请输入用户名" /></div>
        <div><input name="password" placeholder="请输入密码" /></div>
        <div><button type="submit">登录</button></div>
      </form>
    `));
  }
});

// 授权中心登录
app.post("/auth/login", (req, res) => {
  console.log('授权中心登录-/auth/login', req.body, req.query)
  const { username, password, } = req.body;
  const { from } = req.query;
  
  const exist = users.find(item => item.username === username && item.password === password);
  if (!exist) {
    // 登录失败时
    const resBody = { message: "Invalid username and password" };
    // 导致页面跳转
    // res.status(404).json(resBody);
    // res.status(500).json(resBody);
    // 阻止页面跳转
    res.status(204).json(resBody);
    return;
  }
  req.session.user = username;
  if (from) {
    // 登录成功，发放ticket
    const ticket = md5(`${user}${secret}`);
    console.log('登录成功，发放ticket', user, ticket)
    return res.redirect(`${from}?ticket=${ticket}`);
  }
  return res.redirect("/");
});

// 授权中心注销登录
app.post("/auth/logout", (req, res) => {
  req.session.user = null;
  return res.redirect("/");
});

// 授权中心检查业务方的登录态
app.get("/check/login", (req, res) => {
  const { from } = req.query;
  const user = req.session.user;
  console.log('/check/login', user);
  if (user) {
    // 全局已登录用户，发放ticket
    const ticket = md5(`${user}${secret}`);
    console.log('全局已登录用户，发放ticket', user, ticket);
    return res.redirect(`${from}?ticket=${ticket}`);
  } else {
    // 全局未登录，让其前往登录
    return res.send(html(`
      <form action="/auth/login?from=${from}" method="post">
        <div><input name="username" placeholder="请输入用户名" /></div>
        <div><input name="password" placeholder="请输入密码" /></div>
        <div><button type="submit">登录</button></div>
      </form>
    `));
  }
});

// 授权中心接受业务后端的请求，校验ticket合法性，并对业务后端发放用户信息（或加密后的用户信息）
app.get("/check/verifyAndGetUserInfo", (req, res) => {
  const { ticket } = req.query;
  const currentUserTicket = md5(`${req.session.user}${secret}`);
  // req.session.user -> always undefined (后端服务之间调用没有会话连接)
  console.log("/check/verifyAndGetUserInfo", req.session.user, ticket, currentUserTicket)
  if (ticket !== currentUserTicket) {
    return res.status(404).json({ message: "Invalid ticket" });
  }
  return res.status(200).json({ data: req.session.user, message: "Verify ticket and get user info successfully" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
