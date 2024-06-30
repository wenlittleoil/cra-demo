const express = require('express')
const path = require('path')
const app = express()
const port = 80
const cookieParser = require('cookie-parser')

app.use(cookieParser())

app.get("/", (req, res) => {
  const sid = req.cookies['sessionId'];
  console.log('登录标示:', sid);
  const file = path.join(__dirname, 'index2.html')
  res.sendFile(file);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
