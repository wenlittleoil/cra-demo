const express = require('express')
const path = require('path')
const app = express()
const port = 3000

app.get("/", (req, res) => {
  const file = path.join(__dirname, 'index.html')
  res.sendFile(file);
});

app.get("/auth/login", (req, res) => {
  if (req.session.user) {
    // 全局已登录用户，发放ticket
    const { from } = req.query;
    return res.redirect(`${from}?ticket=666888`);
  } else {
    // 全局未登录，让其登录
    const htmlStr = `
      <form>
        <div><input name="username" /></div>
        <div><input name="password /></div>
        <div><button>登录</button></div>
      </form>
    `;
    res.send(htmlStr)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
