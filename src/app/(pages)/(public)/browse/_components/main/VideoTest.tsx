import { testVidAsset } from '@/app/common/testasset'
import MuxVideo from '@mux/mux-video-react'

interface Props {
  video: any
}
export default function VideoTest(props: Props) {
  const { video } = props
  const playbackId = video?.asset?.playbackId

  if (playbackId) {
    return (
      <MuxVideo
        className="z-[10] w-full h-full"
        playbackId={playbackId}
        metadata={{
          video_title: 'lux cache'
        }}
        muted
        loop
        autoPlay
      ></MuxVideo>
    )
  } else {
    return null
  }
}
