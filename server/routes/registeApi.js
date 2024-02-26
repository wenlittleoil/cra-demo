const users = [
  {
    name: 'wen',
    password: '123',
    logined: true,
  },
  {
    name: 'jane',
    password: '123',
    logined: true,
  },
  {
    name: 'jack',
    password: '123',
    logined: true,
  },
];

const registeApi = app => {
  app.post('/api/login', (req, res) => {
    const { name, password } = req.body;
    const existUser = users.find(item => item.name === name && item.password === password);
    if (existUser) {
      existUser.logined = true;
      res.send('success');
    }
    else res.send('error');
  });
  app.post('/api/logout', (req, res) => {
    const { name, } = req.body;
    const existUser = users.find(item => item.name === name);
    if (existUser) existUser.logined = false;
    res.send('success')
  });
  app.post('/api/friends', (req, res) => {
    const { name, } = req.body;
    const friends = users.filter(item => item.name !== name)
    res.send(friends)
  });
}

module.exports = registeApi;
