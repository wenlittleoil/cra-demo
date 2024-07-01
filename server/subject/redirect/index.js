const express = require('express')
const path = require('path')
const app = express()
const port = 3001
const cookieParser = require('cookie-parser')

app.use(cookieParser())

app.get("/", (req, res) => {
  console.log('req.cookies', req.cookies)
  const file = path.join(__dirname, 'index.html')
  res.sendFile(file);
});

// 一、页面访问的重定向（通过浏览器直接输入url访问，会发生网页级别的重定向）
app.get("/page/1", (req, res) => {
  console.log('访问了/page/1')
  return res.redirect("/page/2")
});

app.get("/page/2", (req, res) => {
  console.log('访问了/page/2')
  res.send("This is Page Two")
});

app.get("/page/3", (req, res) => {
  console.log('访问了/page/3')
  return res.redirect("http://www.baidu.com");
});

app.get("/page/4", (req, res) => {
  console.log('访问了/page/4')
  return res.redirect("http://localhost:3002/getcookie");
});

// 二、API异步请求的重定向（通过浏览器fetch或xhr请求）
app.get("/api/1", (req, res) => {
  console.log('访问了/api/1')
  // 请求会先返回一个302 Location到客户端浏览器，然后浏览器再自动重新向Location地址发起另一个请求
  return res.redirect("/api/2");
});

app.get("/api/2", (req, res) => {
  console.log('访问了/api/2')
  res.send("hello west");
});

app.get("/api/3", (req, res) => {
  console.log('访问了/api/3')
  return res.redirect("http://www.baidu.com");
});

app.get("/api/4", (req, res) => {
  console.log('访问了/api/4')
  // API请求的redirect，只会让浏览器重新发起redirect的API请求（并且是跨源的，同样受到浏览器同源策略的限制），不会导致网页级别的重定向
  // 因为重定向的是域名完全不同的跨源API（指一级域名也不同），所以也不会带上cookie凭据
  return res.redirect("http://localhost:3002/getcookie");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

