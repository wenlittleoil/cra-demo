# 生成hls视频片段的成功案例（系统先安装ffmpeg命令行工具）
# chmod +x ./generateHLS.sh && ./generateHLS.sh

ffmpeg -y \
  -i input.mp4 \
  -force_key_frames "expr:gte(t,n_forced*2)" \
  -sc_threshold 0 \
  -s 1280x720 \
  -c:v libx264 -b:v 1500k \
  -c:a copy \
  -hls_time 6 \
  -hls_playlist_type vod \
  -hls_segment_type fmp4 \
  -hls_segment_filename "hls_output/segment_chunk_%d.m4s" \
  hls_output/index.m3u8
