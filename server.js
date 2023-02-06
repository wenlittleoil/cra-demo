const express = require('express');
const path = require('path');

const app = express();

// app.use(express.static(path.join(__dirname, 'build')));
app.use('/wen-base', express.static(path.join(__dirname, 'build'))); // 基础资源公共路径

// 仅支持哈希路由
// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// 支持h5历史路由
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = 3000;
app.listen(port, () => {
  console.log(`server is listening at ${port}`);
});
