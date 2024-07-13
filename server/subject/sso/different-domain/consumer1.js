/**
 * 业务方1（sso消费端）
 * 采用前后端分离架构
 */
const express = require('express')
const path = require('path')
const app = express()
const port = 3001

app.get("/", (req, res) => {
  const file = path.join(__dirname, 'consumer1.html')
  res.sendFile(file);
});

app.get("/api/protected-resource", (req, res) => {
  if (req.session.user) {
    res.status(200).json({ errCode: 0, data: req.session.user })
  } else {
    res.status(200).json({ errCode: 302, data: null })
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
