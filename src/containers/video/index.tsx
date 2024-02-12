import React, { useEffect, useRef } from 'react';
import './index.scss';

const VideoPage = () => {
  const videoInited = useRef(false)

  useEffect(() => {
    const video = document.querySelector("video");

    const assetURL = "/api/media/test.mp4";
    // Need to be specific for Blink regarding codecs
    // ./mp4info frag_bunny.mp4 | grep Codec
    const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

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
      const init = () => {
        const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
        fetchAB(assetURL, function (buf) {
          sourceBuffer.addEventListener("updateend", function (_) {
            mediaSource.endOfStream();
            video.play();
            videoInited.current = true;
            playBtn.removeEventListener("click", init);
            //console.log(mediaSource.readyState); // ended
  
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
      <video 
        // muted 
        // loop
      />
      <div>
        <button className='play-btn' onClick={handleClickPlay}>播放</button>
        <button className='pause-btn' onClick={handleClickPause}>暂停</button>
        <button className='back-btn' onClick={handleClickBack}>回到第20s</button>
      </div>
    </div>
  )
}

export default VideoPage
