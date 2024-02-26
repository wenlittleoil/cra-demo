import axios from "axios";
import { useEffect, useState } from "react";
import "./index.scss";

let socket;

const rtcConnectConfig = {
  'iceServers': [
    {'urls': 'stun:stun.stunprotocol.org:3478'},
    {'urls': 'stun:stun.l.google.com:19302'},
  ]
};
let rtcConnectionA;
let rtcConnectionB;

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
    // 初始化页面时马上建立websocket连接，用于普通业务通信
    // socket = new WebSocket('ws://localhost:3000')
    socket = new WebSocket('wss://localhost:3000')
    socket.addEventListener('open', () => {
      // socket.send('你好 123 world');
    });
    socket.addEventListener('message', (msg) => {
      // console.log('收到消息: ', msg.data)
      try {
        const data = JSON.parse(msg.data);
        handleMessage(data);
      } catch(err) {}
    });
  }, [])

  async function handleMessage(data) {
    console.log('处理消息：', user, data)
    if (user !== data?.target) return;

    if (data.eventType === "video-offer") {
      // B端接受视频邀请，然后发出应答
      const localStream = await getLocalStream();
      rtcConnectionB = new RTCPeerConnection(rtcConnectConfig);

      for(const track of localStream.getTracks()) {
        rtcConnectionB.addTrack(track, localStream);
      }

      rtcConnectionB.ontrack = getRemoteStream;

      rtcConnectionB.onicecandidate = event => getIceCandidate(event, data.name);

      try {
        await rtcConnectionB.setRemoteDescription(new RTCSessionDescription(data.eventInfo));

        const answer = await rtcConnectionB.createAnswer(); // RTCSessionDescription
        console.log('answer: ', answer)
        await rtcConnectionB.setLocalDescription(answer);
        // send to signal server
        const msg = JSON.stringify({
          name: data.target,
          target: data.name,
          eventType: "video-answer",
          eventInfo: rtcConnectionB.localDescription, // RTCSessionDescription
        });
        socket.send(msg);
      } catch(err) {
        console.log(err)
      }

    } else if (data.eventType === "video-answer") {
      // A端收到应答
      rtcConnectionA.setRemoteDescription(new RTCSessionDescription(data.eventInfo));
    } else if (data.eventType === "opposite-candidate") {
      // A端和B端交换设置对方的ice候选
      const curRtcConnection = rtcConnectionA || rtcConnectionB;
      curRtcConnection.addIceCandidate(new RTCIceCandidate(data.eventInfo));
    }
  }

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

  const getLocalStream = async () => {
    const constraints = {
      video: true,
      audio: true,
    }
    const localStream = await navigator.mediaDevices.getUserMedia(constraints)
    const localVideo = document.querySelector('video.local') as HTMLMediaElement;
    localVideo.srcObject = localStream;
    localVideo.muted = true; // 本地端视频不需要重复听见自己的声音
    localVideo.play(); // 需要设置播放，不然不会自动播放
    return localStream;
  }

  const getRemoteStream = async (event) => {
    const remoteStream = event.streams[0];
    const remoteVideo = document.querySelector('video.remote') as HTMLMediaElement;
    remoteVideo.srcObject = remoteStream;
    remoteVideo.muted = false; // 需要听见远程端视频声音
    remoteVideo.play(); // 需要设置播放，不然不会自动播放 
    return remoteStream;
  }

  const getIceCandidate = (event, target) => {
    console.log('candidate: ', event.candidate)
    if (event.candidate) {
      const msg = JSON.stringify({
        name: user,
        target,
        eventType: "opposite-candidate",
        eventInfo: event.candidate,
      });
      socket.send(msg);
    }
  }
 
  const startCall = async (friend) => {
    const localStream = await getLocalStream();
    rtcConnectionA = new RTCPeerConnection(rtcConnectConfig);

    // 添加本地端视频流
    for(const track of localStream.getTracks()) {
      rtcConnectionA.addTrack(track, localStream);
    }

    // 添加远程端视频流
    rtcConnectionA.ontrack = getRemoteStream;

    // 获得ice候选后，互相交换，然后添加对方的候选地址
    rtcConnectionA.onicecandidate = event => getIceCandidate(event, friend.name);

    try {
      // A端发起视频邀请
      const offer = await rtcConnectionA.createOffer(); // RTCSessionDescription
      console.log('offer: ', offer)
      await rtcConnectionA.setLocalDescription(offer);
      // send to signal server
      const msg = JSON.stringify({
        name: user,
        target: friend.name,
        eventType: "video-offer",
        eventInfo: rtcConnectionA.localDescription, // RTCSessionDescription
      });
      socket.send(msg);
    } catch(err) {
      console.log(err)
    }
  }

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
    <div className="webrtc2-page">
      <div>用户：{user} <button onClick={logout}>退出登录</button></div>
      <div>
        <div>好友列表：</div>
        <div>
          {friends.map(friend => {
            return (
              <div key={friend.name}>
                {friend.name}
                &nbsp;&nbsp;
                {friend.logined ? 
                  <button onClick={() => startCall(friend)}>发起通话</button> : 
                  '不在线'
                }
              </div>
            )
          })}
        </div>
        <div className="video-group">
          <video className="remote" />
          <video className="local" />
        </div>
      </div>
    </div>
  )
}

export default Index;
