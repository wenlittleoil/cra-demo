const {
  beBasePath,
} = require('../constant');
const path = require('path');

module.exports = app => {
  // 获取视频时
  app.use("/api/media/test.mp4", function (req, res) {
    res.sendFile(path.join(beBasePath, 'static', 'videos', 'test.mp4'));
  });
}
