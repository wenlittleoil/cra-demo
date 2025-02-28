/**
 * 请先启动localhost:8080下的媒体资源的静态服务
 * （包含使用ffmpeg生成的m3u8和ts片段文件，相关命令：
 *    ffmpeg -i ./video.mp4 -codec: copy -start_number 0 -hls_time 10 -hls_list_size 0 -f hls output.m3u8
 * ）
 */
import Hls from "hls.js";
import { useEffect } from "react";

const Index = () => {

  // 使用hls协议播放流媒体视频
  useEffect(() => {
    const video = document.getElementById('videoPlayer') as HTMLVideoElement;
    const videoSrc = `http://localhost:8080/output.m3u8`;
    if (Hls.isSupported()) {
      const hls = new Hls();

      /**
       * 此方法是通过xhr请求m3u8文件，然后解析其中的ts片段文件
       * 因此localhost:8080服务应该允许跨域请求
       */
      hls.loadSource(videoSrc); 

      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
    }
  }, [])

  return (
    <div>
      <h2>流媒体视频播放案例</h2>
      <video 
        id="videoPlayer" 
        controls
        muted
        autoPlay
        style={{
          width: '640px',
          height: '360px',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}

export default Index;
