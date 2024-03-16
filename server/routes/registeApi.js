const auth = require('./auth');
const upload = require('./upload');

const registeApi = app => {
  auth(app);
  upload(app);
}

module.exports = registeApi;
