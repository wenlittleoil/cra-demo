# sso单点登录和注销原理

## 步骤一：`sudo vim /etc/hosts`
```
# sso different-domain
127.0.0.1 sso.center.com
# sso消费端1（业务服务器1接入）
127.0.0.1 one.consumerone.cn
# sso消费端2（业务服务器2接入）
127.0.0.1 two.consumertwo.in
```

## 步骤二：启动sso授权中心服务 `node index.js`

## 步骤三：
1. 启动sso消费端1（业务服务1） `node consumer1.js`
2. 启动sso消费端2（业务服务2） `node consumer2.js`

## 步骤四：浏览器依次访问
`http://sso.center.com:3000`
`http://one.consumerone.cn:3001`
`http://two.consumertwo.in:3002`

