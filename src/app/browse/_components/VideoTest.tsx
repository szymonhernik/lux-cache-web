import MuxVideo from '@mux/mux-video-react'

export default function VideoTest() {
  return (
    <MuxVideo
      playbackId="6CmQytdllsC16IdzLXWcecHgPfaxWVgibAS73Pj01lGA"
      metadata={{
        video_title: 'lux cache'
      }}
      muted
      loop
      // autoPlay
    ></MuxVideo>
  )
}
