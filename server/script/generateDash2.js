/**
 * 生成dash视频片段的成功案例
 * node ./generateDash2.js
 */
const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegStatic);

const inputPath = 'input.mp4';
const outputPath = 'dash_output2/output.mpd';
const scaleOptions = ['scale=1280:720', 'scale=640:320'];
const videoCodec = 'libx264';
const x264Options = 'keyint=24:min-keyint=24:no-scenecut';
const videoBitrates = ['1000k', '2000k', '4000k'];

ffmpeg()
  .input(inputPath)
  .videoFilters(scaleOptions)
  .videoCodec(videoCodec)
  .addOption('-x264opts', x264Options)
  .outputOptions('-b:v', videoBitrates[0])
  .format('dash')
  .output(outputPath)
  .on('end', () => {
    console.log('DASH encoding complete.');
  })
  .on('error', (err) => {
    console.error('Error:', err.message);
  })
  .run();
