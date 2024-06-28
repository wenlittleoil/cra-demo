/**
 * 若domain完全相同，则不存在sso问题，这里指的是相同顶级域名、子域名不同的情况
 * index模拟服务端API；
 * index2模拟浏览器端网站一，index3模拟浏览器端网站二，它们同时向服务端API发起请求
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

app.put('/api/hello', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
