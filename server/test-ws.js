// node test-ws.js
const { exit } = require('process');
const ws = require('ws');

const client = new ws('ws://localhost:3000');

client.on('open', () => {
  // Causes the server to print
  client.send('你好 123 hello');
  // exit after send message
  exit()
});
