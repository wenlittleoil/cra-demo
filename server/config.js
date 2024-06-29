const path = require('path');
const fs = require('fs');

exports.secureServerOptions = {
  key: fs.readFileSync(path.join(__dirname, './key.pem')),
  cert: fs.readFileSync(path.join(__dirname, './cert.pem')),
}
