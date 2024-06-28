const express = require('express')
const fs = require('fs');
const path = require('path');

const app = express()
const port = 3003

app.get("/", (req, res) => {
  const file = path.join(__dirname, 'index3.html')
  res.sendFile(file);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
