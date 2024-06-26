// 勿参考该案例，程序逻辑有缺陷
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    var queue = [];

    // Check that browser has support for media codec
    var mimeCodec = 'video/mp4; codecs="avc1.4D401F"';
    console.log(MediaSource.isTypeSupported(mimeCodec));

    // Create Media Source
    var mediaSource = new MediaSource(); // mediaSource.readyState === 'closed'

    // Get video element
    var video = document.querySelector('video');

    // Attach media source to video element
    video.src = URL.createObjectURL(mediaSource);

    // Wait for media source to be open
    mediaSource.addEventListener('sourceopen', handleSourceOpen.bind(mediaSource));

    function handleSourceOpen() {
      var mediaSource = this; // mediaSource.readyState === 'open'
      var sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);

      /*** 
        "Parse" manifest -> segments
      
            <Representation
              id="video=1660000"
              bandwidth="1660000"
              width="1280"
              height="720"
              sar="1:1"
              codecs="avc1.4D401F"
              scanType="progressive">
              <SegmentTemplate
                timescale="12800"
                initialization="vinn-$RepresentationID$.dash"
                media="vinn-$RepresentationID$-$Time$.dash">
                <SegmentTimeline>
                  <S t="0" d="25600" r="51" />
                  <S d="20992" />
                </SegmentTimeline>
              </SegmentTemplate>
            </Representation>
      ***/
      queue.push("https://testcontent.eyevinn.technology/mse-tutorial/vinn-video=1660000-0.dash");
      queue.push("https://testcontent.eyevinn.technology/mse-tutorial/vinn-video=1660000-25600.dash");
      queue.push("https://testcontent.eyevinn.technology/mse-tutorial/vinn-video=1660000-51200.dash");

      mediaSource.duration = 6; // (51200 + 25600) / 12800

      var url; // request url of fetching segment
      // Fetch init segment (contains mp4 header)
      fetchSegmentAndAppend("https://testcontent.eyevinn.technology/mse-tutorial/vinn-video=1660000.dash", sourceBuffer, function() {

        function iter() {
          // 程序逻辑有缺陷，会被频繁调用
          console.log('iter函数被调用啦');

          // Pop segment from queue
          url = queue.shift();
          if (url === undefined) {
            return;
          }

          // Download segment and append to source buffer
          fetchSegmentAndAppend(url, sourceBuffer, function(err) {
            if (err) {
              console.error(err);
            } else {
              // delay 5 seconds then fetch next segment chunk
              setTimeout(iter, 5000);
            }
          });
        }
        iter();
        video.play();
      });
    }

    function fetchSegmentAndAppend(segmentUrl, sourceBuffer, callback) {
      fetchArrayBuffer(segmentUrl, function(buf) {
        sourceBuffer.addEventListener('updateend', function(ev) {
          callback();
        });
        sourceBuffer.addEventListener('error', function(ev) {
          callback(ev);
        });
        sourceBuffer.appendBuffer(buf);
      });
    }

    function fetchArrayBuffer(url, callback) {
      var xhr = new XMLHttpRequest();
      xhr.open('get', url);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function() {
        callback(xhr.response);
      };
      xhr.send();
    }

  }, []);
  return (
    <div>
      <video 
        style={{
          width: '640px', 
          height: '360px', 
          border: 'solid 1px'
        }}
        muted
        loop
        controls
      />
    </div>
  )
}

export default Index;
