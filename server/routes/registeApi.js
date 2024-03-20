const auth = require('./auth');
const upload = require('./upload');
const fetchVideo = require('./fetchVideo');

const registeApi = app => {
  auth(app);
  upload(app);
  fetchVideo(app);
}

module.exports = registeApi;
