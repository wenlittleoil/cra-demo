const express = require('express')
const app = express()
const port = 3002
const cookieParser = require('cookie-parser')

app.use(cookieParser())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  next()
});

app.get("/setcookie", (req, res) => {
  res.cookie("sid", "666888", {
    httpOnly: true,
  });
  res.send("setcookie success!");
});

app.get("/getcookie", (req, res) => {
  res.send(`getcookie ${JSON.stringify(req.cookies)}`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
