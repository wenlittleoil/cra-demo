/**
 * 使用nodejs探索传统直播技术原理（不同于较新的webrtc协议）：
 * 
 * 参考文档：https://github.com/illuspas/Node-Media-Server
 * 启动媒体服务器：node ./node-media-server.js
 * 进行直播推流（推送媒体流）：
 *   1、ffmpeg -re -i ./input.mp4  -c copy -f flv rtmp://localhost/live/wenwest
 *   2、ffmpeg -re -i ./input.mp4  -c:v libx264 -preset veryfast -tune zerolatency -c:a aac -ar 44100 -f flv rtmp://localhost/live/wenwest
 * https://localhost:3000/wen-base/live-stream
 *   3、使用开源软件OBS
 * 进行直播拉流：
 *    浏览器打开：https://localhost:3000/wen-base/live-stream
 *    可使用hls/dash/flv/rtmp等多种协议访问媒体流，浏览器端对flv/rtmp(由于需要flash)的支持已过时，推荐使用hls/dash
 */
const NodeMediaServer = require('node-media-server');

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*',
    
    mediaroot: "./nms-media",
  },
  trans: {
    ffmpeg: '/usr/local/bin/ffmpeg',
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        hlsKeep: true, // to prevent hls file delete after end the stream
        dash: true,
        dashFlags: '[f=dash:window_size=3:extra_window_size=5]',
        dashKeep: true // to prevent dash file delete after end the stream
      }
    ]
  }
};

var nms = new NodeMediaServer(config)
nms.run();
