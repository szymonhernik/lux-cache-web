import MuxVideo from '@mux/mux-video-react'

export default function VideoTest() {
  return (
    <MuxVideo
      playbackId="WAJskpJEdrvho71n7CZkRjno0200Ewry2jGRhSf654IzY"
      metadata={{
        video_title: 'lux cache'
      }}
      muted
      loop
      autoPlay
    ></MuxVideo>
  )
}
