import axios from "axios";
import { useEffect, useState } from "react";

const Index = () => {
  // 当前登录用户
  const [user, setUser] = useState(window.localStorage.getItem('user') || '')
  // 当前登录用户的好友列表
  const [friends, setFriends] = useState([])
  // 用户未登录时的登录表单状态
  const [form, setForm] = useState({
    name: '',
    password: '',
  })
  useEffect(() => {
    // const socket = new WebSocket('ws://localhost:3000')
    const socket = new WebSocket('wss://localhost:3000')
    socket.addEventListener('open', function open() {
      socket.send('你好 123 world');
    });
    socket.addEventListener('message', (msg) => {
      console.log('收到消息啦: ', msg.data)
    });
  }, [])

  const login = async () => {
    axios.post('/api/login', form).then(res => {
      if (res.data === 'success') {
        setUser(form.name)
        window.localStorage.setItem('user', form.name)
      }
    })
  }

  const logout = async () => {
    axios.post('/api/logout', { name: user }).then(res => {
      if (res.data === 'success') {
        setUser('')
        window.localStorage.removeItem('user')
      }
    })
  }

  useEffect(() => {
    if (!user) return;
    fetchFriends(user);
  }, [user])
  const fetchFriends = async (user) => {
    axios.post('/api/friends', { name: user }).then(res => {
      console.log('获取朋友列表', res)
      if (Array.isArray(res.data)) {
        setFriends(res.data)
      }
    })
  }

  const bindHandler = field => e => setForm(prev => ({
    ...prev,
    [field]: e.target.value?.trim(),
  }))

  if (!user) {
    return (
      <div>
        <input 
          placeholder="请输入用户名称" 
          onChange={bindHandler('name')} 
        />
        <input 
          placeholder="请输入密码" 
          onChange={bindHandler('password')} 
        />
        <button onClick={login}>登录</button>
      </div>
    )
  }
  return (
    <div style={{ padding: '20px' }}>
      <div>用户：{user} <button onClick={logout}>退出登录</button></div>
      <div>
        <div>好友列表：</div>
        <div>
          {friends.map(friend => {
            return (
              <div key={friend.name}>
                {friend.name}
                &nbsp;&nbsp;
                {friend.logined ? <button>发起通话</button> : '不在线'}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Index;
