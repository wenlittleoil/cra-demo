/**
 * sso授权服务中心
 * 采用前后端一体化架构
 */
const express = require('express')
const app = express()
const session = require('express-session')
const port = 3000

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

app.use(express.urlencoded())

app.get("/", (req, res) => {
  console.log('req.session: ', req.session)
  if (req.session.user) {
    res.send(html`
      <div>
        <span>Hello i'm ${JSON.stringify(req.session.user)}</span>
        <a>Logout</a>
      </div>
    `);
  } else {
    res.send(html`
      <form action="/auth/login" method="post">
        <div><input name="username" placeholder="请输入用户名" /></div>
        <div><input name="password" placeholder="请输入密码" /></div>
        <div><button type="submit">登录</button></div>
      </form>
    `);
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
  res.status(200).json({ message: `${username} login success`});
  
});

// 授权中心注销登录
app.post("/auth/logout", (req, res) => {
  
});

// 授权中心检查业务方的登录态
app.get("/check/login", (req, res) => {
  const { from } = req.query;
  if (req.session.user) {
    // 全局已登录用户，发放ticket
    console.log('全局已登录用户，发放ticket', req.session.user)
    // return res.redirect(`${from}?ticket=666888`);
  } else {
    // 全局未登录，让其前往登录
    return res.send(html`
      <form action="/auth/login?from=${from}" method="post">
        <div><input name="username" placeholder="请输入用户名" /></div>
        <div><input name="password" placeholder="请输入密码" /></div>
        <div><button type="submit">登录</button></div>
      </form>
    `);
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
