'use client'

import { useState } from 'react'

interface Props {
  previewVideo: {
    video: {
      _key: null
      _type: 'cloudinary.asset'
      format: string | null
      public_id: string | null
    } | null
  }
}
export default function PreviewVideo(props: Props) {
  const { previewVideo } = props

  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  const video = previewVideo?.video

  const handleVideoLoad = () => {
    setIsVideoLoaded(true)
  }

  if (video && video.public_id && video.format) {
    return (
      <>
        <video
          className={`h-full w-full min-w-screen lg:min-w-auto ${!isVideoLoaded ? 'hidden' : ''}`}
          playsInline
          autoPlay
          muted
          loop
          onLoadedData={handleVideoLoad}
        >
          <source
            src={`https://cloud-lc.b-cdn.net/video/upload/w_500/q_80/f_webm/${video.public_id}.webm`}
            type="video/webm"
          />
          <source
            src={`https://cloud-lc.b-cdn.net/video/upload/w_500/q_80/f_mp4/${video.public_id}.mp4`}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </>
    )
  }
}
// https://stream.mux.com/abcd1234/capped-1080p.mp4
// https://stream.mux.com/lRE02tg8pyThyQnKsI02qp81bBlzgtLCRwVCUThlj5l7E
