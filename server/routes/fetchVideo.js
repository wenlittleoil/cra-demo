const {
  beBasePath,
} = require('../constant');
const path = require('path');
const fs = require('fs');

module.exports = app => {
  const mp4FilePath = path.join(beBasePath, 'static', 'videos', 'test.mp4');

  // 获取整个视频
  app.get("/api/media/testmp4", function (req, res) {
    console.log('获取整个视频')
    res.sendFile(mp4FilePath);
  });

  // 获取视频某个片段（通过http标准头部Range）
  app.get("/api/media/testmp4/part", function (req, res) {
    // Ensure there is a range given for the video
    const range = req.headers.range;
    if (!range) {
      res.status(400).send("Requires Range header");
    }
  
    const videoPath = mp4FilePath;
    const videoSize = fs.statSync(mp4FilePath).size;

    console.log('获取文件字节范围', range, videoSize)
  
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  
    // Create headers
    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };
  
    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);
  
    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });
  
    // Stream the video chunk to the client
    videoStream.pipe(res);
  });

  // 获取视频某个片段（通过http自定义请求）
  app.get("/api/media/testmp4/part-v2", function (req, res) {
    const {
      start,
      end,
    } = req.query;
    const _start = Number(start);
    const videoSize = fs.statSync(mp4FilePath).size;
    const _end = Math.min(Number(end), videoSize - 1);

    const videoStream = fs.createReadStream(mp4FilePath, { 
      start: _start, 
      end: _end,
    });
    console.log('分段获取视频片段', _start, _end)
    videoStream.pipe(res);
  });

}
