import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    const v = document.querySelector('video')
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    }).then(stream => {
      console.log('getUserMedia-success', stream)
      v.srcObject = stream
      v.play()
    }).catch((err) => {
      console.error('getUserMedia-error', err);
    });

    const width = 400;
    v.addEventListener('canplay', ev => {
      console.log('可以播放了', v)
      // 通过实际视频宽高确定容器video元素的宽高
      const height = (v.videoHeight / v.videoWidth) * width;
      v.setAttribute('width', `${width}px`);
      v.setAttribute('height', `${height}px`);
    });

    const btn = document.querySelector('button')
    btn.addEventListener('click', ev => {
      const cs = document.querySelector('canvas')
      cs.setAttribute('width', `${v.width}px`)
      cs.setAttribute('height', `${v.height}px`)
      const ctx = cs.getContext("2d")
      ctx.drawImage(v, 0, 0, v.width, v.height)

      const data = cs.toDataURL("image/png")
      const img = document.querySelector('img')
      img.src = data
    });

  }, [])

  return (
    <div>
      <video />
      <button style={{ display: 'block' }}>生成截图</button>
      <canvas />
      <img style={{ display: 'block' }} />
    </div>
  )
}

export default Index;
