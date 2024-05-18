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
})
