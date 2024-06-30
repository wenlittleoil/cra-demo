/**
 * 若domain完全相同，则不存在sso问题，这里指的是相同一级域名、二级域名不同的情况
 * 可通过共享一级域名下的cookie来解决
 * 
 * 两台本地机器连接同一个wifi，在同一个局域网内部：
 *  index模拟站点一（a.west.com -> 本地机器1的IP地址127.0.0.1）
 *  index2模拟站点二（b.west.com -> 本地机器2的IP地址192.168.0.102）
 * 
 *  操作步骤一：在本地机器1上修改hosts文件
 *    sudo vim /etc/hosts
 *    127.0.0.1 a.west.com
 *    192.168.0.102 b.west.com
 *  操作步骤二：在本地机器2上运行`node index2.js`启动模拟站点二
 *  操作步骤三：在本地机器1上分别访问 http://a.west.com 和 http://b.west.com 两个模拟站点
 *  操作步骤四：通过cookie登录凭证sessionId来模拟体验sso流程
 */
const express = require('express')
const path = require('path')
const app = express()
const port = 80
const cookieParser = require('cookie-parser')

app.use(cookieParser())

app.get("/", (req, res) => {
  const file = path.join(__dirname, 'index.html')
  res.sendFile(file);
});

app.post('/api/login', (req, res) => {
  // 模拟登录过程发放登录标示
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  res.cookie("sessionId", "abc123", {
    // sameSite: "none",
    // secure: true,
    
    httpOnly: true,
    domain: 'west.com', // 同'.west.com'
    maxAge: expiresIn
  });
  res.send('login success!');
});

app.post('/api/logout', (req, res) => {
  // 模拟退出登录过程，回收登录标示
  res.clearCookie("sessionId", {
    domain: 'west.com',
  });
  res.send('logout success!');
});

app.get('/api/protected-resource', (req, res) => {
  // 模拟请求获取受保护的资源
  const sid = req.cookies['sessionId'];
  console.log('登录标示:', sid);
  if (sid) {
    res.send('获取受保护的资源-成功!');
  } else {
    res.send('获取受保护的资源-失败');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
