import React, { useEffect, useRef } from 'react';
import './index.scss';

const VideoPage = () => {
  const videoInited = useRef(false)

  useEffect(() => {
    const video = document.querySelector("#stream-media-video") as HTMLMediaElement;

    // 通过xhr请求获取整个视频文件
    // const assetURL = "/api/media/testmp4";
    // 通过xhr请求获取部分视频片段(视频总共1.5M，先获取前面1M部分，接着获取后面0.5M部分)
    const assetURL = "/api/media/testmp4/part-v2?start=0&end=1000000"; 

    // 使用Bento4下bin提供的命令行工具分析mp4文件
    // Need to be specific for Blink regarding codecs
    // ./mp4info test.mp4 | grep Codec
    const mimeCodec = 'video/mp4; codecs="avc1.64081F, mp4a.40.2"';

    if ("MediaSource" in window && MediaSource.isTypeSupported(mimeCodec)) {
      const mediaSource = new MediaSource();
      //console.log(mediaSource.readyState); // closed
      video.src = URL.createObjectURL(mediaSource);

      mediaSource.addEventListener("sourceopen", sourceOpen);

    } else {
      console.error("Unsupported MIME type or codec: ", mimeCodec);
    }

    function sourceOpen(_) {
      console.log('[mediaSource sourceopen event trigger]: ', this.readyState); // open
      const mediaSource = this;

      const playBtn = document.querySelector('.play-btn');
      let count = 0;
      const init = () => {
        const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
        sourceBuffer.mode = 'segments';
        fetchAB(assetURL, function (buf) {
          sourceBuffer.addEventListener('error', (e) => {
            console.error("sourceBuffer error", e);
          });

          sourceBuffer.addEventListener("updateend", function (_) {
            count++;
            if (count === 2) {
              mediaSource.endOfStream();
            }
            
            video.play();
            videoInited.current = true;
            playBtn.removeEventListener("click", init);
            //console.log(mediaSource.readyState); // ended

            // 如果是分段获取，则接着获取后面0.5M部分
            if (assetURL.includes("part-v2") && count === 1) {
              fetchAB("/api/media/testmp4/part-v2?start=1000001&end=999999999999999", function (secondBuf) {
                sourceBuffer.appendBuffer(secondBuf);
              });
            }
  
          });
          sourceBuffer.appendBuffer(buf);

        });
      }
      playBtn.addEventListener("click", init)

    }

    function fetchAB(url, cb) {
      const xhr = new XMLHttpRequest();
      xhr.open("get", url);
      xhr.responseType = "arraybuffer";
      xhr.onload = function () {
        cb(xhr.response);
      };
      xhr.send();
    }

  }, [])

  const handleClickPlay = () => {
    const video = document.querySelector("video")
    if (videoInited.current) {
      video.play()
    }
  }

  const handleClickPause = () => {
    const video = document.querySelector("video")
    video.pause();
  }

  const handleClickBack = () => {
    const video = document.querySelector("video")
    video.currentTime = 20
  }

  return (
    <div>
      {/* 1、流媒体(通过xhr请求获取视频片段，视频已经提前被分割成片段放置在服务器磁盘中) */}
      <video 
        id='stream-media-video'
        muted 
        // loop
        width="400px"
        height="400px"
        style={{
          objectFit: 'contain',
        }}
        controls
      />
      <div>
        <button className='play-btn' onClick={handleClickPlay}>播放</button>
        <button className='pause-btn' onClick={handleClickPause}>暂停</button>
        <button className='back-btn' onClick={handleClickBack}>回到第20s</button>
      </div>

      {/* 2、流媒体(通过http请求获取视频片段，视频并没有被分割成片段，
        而是以完整文件的形式存在于服务器磁盘中，通过http头部Content-Range控制返回视频片段) */}
      {/* <video id="videoPlayer" width="70%" controls autoPlay muted src="/api/media/testmp4/part" /> */}

      {/* 3、本域内的静态媒体(边下边播) */}
      {/* <video 
        src='/wen-base/media/test-static.webm' 
        autoPlay 
        muted 
        style={{
          marginTop: '20px',
        }} 
      /> */}

      {/* 4、外域内的静态媒体(边下边播) */}
      {/* <video 
        src='https://graff-1253185145.cos.ap-guangzhou.myqcloud.com/test-static-1708072702709-v2.mp4' 
        autoPlay 
        muted 
        style={{
          marginTop: '20px',
          width: '400px',
          height: '400px',
          objectFit: 'contain',
        }} 
      /> */}
    </div>
  )
}

export default VideoPage
