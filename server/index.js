/**
 * 仅供本地开发调试使用
 * 若要部署到服务器，则需要引入webpack将该文件构建并输出
 */
const express = require('express');
const path = require('path');
const { WebSocketServer } = require('ws');

const app = express();

const feBasePath = path.join(__dirname, '..', 'build');

// app.use(express.static(feBasePath));
app.use('/wen-base', express.static(feBasePath)); // 基础资源公共路径

// 获取视频时
const assetURL = "/api/media/test.mp4";
app.use(assetURL, function (req, res) {
  res.sendFile(path.join(feBasePath, 'media', 'test.mp4'));
})

// 支持h5历史路由
app.get('*', function (req, res) {
  // console.log('测试', req.headers['cookie']);
  res.sendFile(path.join(feBasePath, 'index.html'));
});

const port = 3000;
const nativeHttpServer = app.listen(port, () => {
  console.log(`server is listening at ${port}`);
});

// listen to websockets on an Express server.
const wsServer = new WebSocketServer({ noServer: true });
wsServer.on('connection', socket => {
  socket.on('message', message => console.log(message.toString()));
});
nativeHttpServer.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});
