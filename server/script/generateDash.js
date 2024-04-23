/**
 * 生成dash视频片段的失败案例
 */
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

// Make sure FFmpeg is available in your system's PATH
ffmpeg.setFfmpegPath('/usr/local/bin/ffmpeg');

// Input video file
const inputPath = 'input.mp4';

// DASH output directory and files
const outputPath = 'dash_output/manifest.mpd';

// Configure FFmpeg for DASH transcoding
ffmpeg(inputPath)
  .outputOptions([
    // DASH options
    '-f dash',
    '-init_seg_name init_$RepresentationID$.m4s',
    '-media_seg_name chunk_$RepresentationID$_$Number%05d$.m4s',
    '-use_timeline 1',
    '-use_template 1',
    '-window_size 5',

    '-adaptation_sets "id=0,streams=v id=1,streams=a"',
    // '-adaptation_sets',
    // '"id=0,streams=v id=1,streams=a"',

    // Video options
    '-map 0:v:0',
    '-c:v:0 libx264',
    '-b:v:0 500k',
    '-s:v:0 640x360',

    // Audio options
    '-map 0:a:0',
    '-c:a:0 aac',
    '-b:a:0 128k',
  ])
  .output(outputPath)
  .on('start', () => {
    console.log('Starting DASH transcoding...');
  })
  .on('progress', (progress) => {
    console.log(`Progress: ${progress.percent.toFixed(2)}%`);
  })
  .on('error', (err, stdout, stderr) => {
    console.error('Error:', err.message);
    console.error('FFmpeg stdout:', stdout);
    console.error('FFmpeg stderr:', stderr);
  })
  .on('end', () => {
    console.log('DASH transcoding completed.');
  })
  .run();
