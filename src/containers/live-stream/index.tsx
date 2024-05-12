/**
 * 请先启动server/node-media-server.js并进行直播推流
 * 参考文档：https://github.com/illuspas/Node-Media-Server
 */
import FlvJs from "flv.js";
import Hls from "hls.js";
import { useEffect } from "react";

const STREAM_NAME = "wenwest";

const Index = () => {

  // 使用hls拉流
  useEffect(() => {
    const video = document.getElementById('videoPlayer') as HTMLVideoElement;
    const videoSrc = `http://localhost:8000/live/${STREAM_NAME}/index.m3u8`;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
    }
  }, [])

  // 使用flv拉流
  // useEffect(() => {
  //   if (FlvJs.isSupported()) {
  //     var videoElement = document.getElementById('videoPlayer') as HTMLVideoElement;
  //     var flvPlayer = FlvJs.createPlayer({
  //       type: 'flv',
  //       url: `http://localhost:8000/live/${STREAM_NAME}.flv`
  //     });
  //     flvPlayer.attachMediaElement(videoElement);
  //     flvPlayer.load();
  //     flvPlayer.play();
  //   }
  // }, [])

  return (
    <div>
      <h2>直播案例</h2>
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
