import { testVidAsset } from '@/app/common/testasset'
import MuxVideo from '@mux/mux-video-react'

export default function VideoTest() {
  return (
    <MuxVideo
      playbackId={testVidAsset.playbackId}
      metadata={{
        video_title: 'lux cache'
      }}
      muted
      loop
      // autoPlay
    ></MuxVideo>
  )
}
