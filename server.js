/**
 * 仅供本地开发调试使用
 * 若要部署到服务器，则需要引入webpack将该文件构建并输出
 */
const express = require('express');
const path = require('path');

const app = express();

// app.use(express.static(path.join(__dirname, 'build')));
app.use('/wen-base', express.static(path.join(__dirname, 'build'))); // 基础资源公共路径

// 获取视频时
const assetURL = "/api/media/test.mp4";
app.use(assetURL, function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'media', 'test.mp4'));
})

// 支持h5历史路由
app.get('*', function (req, res) {
  console.log('测试', req.headers['cookie']);
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = 3000;
app.listen(port, () => {
  console.log(`server is listening at ${port}`);
});
