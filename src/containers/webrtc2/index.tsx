import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000')
    ws.addEventListener('open', function open() {
      ws.send('你好 123 world');
    });
    ws.addEventListener('message', (msg) => {
      console.log('收到消息啦: ', msg.data)
    });
  }, [])

  return (
    <div>
    </div>
  )
}

export default Index;
